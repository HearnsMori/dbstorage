//to set, remove, or get

const Storage = require('../models/Storage'); // Corrected import path

/**
 * Utility: Converts a single value (string) or an array of values (string[])
 * into an array of values. Handles undefined/null input by returning an empty array.
 * @param {string | string[] | any} input - The input value.
 * @returns {Array} An array containing all unique values.
 */
function normalizeInput(input) {
    if (input === undefined || input === null) {
        return [];
    }
    return Array.isArray(input) ? input : [input];
}

/**
 * Utility: Constructs a Mongoose query object from the body.
 */
function buildMongooseQuery(body) {
    const query = {};
    const fields = ['app', 'collectionName', 'collectionKey', 'key', 'value'];

    for (const field of fields) {
        const input = body[field];

        if (input !== undefined && input !== null) {
            if (Array.isArray(input)) {
                if (input.length > 0) {
                    query[field] = { $in: input };
                }
            } else {
                query[field] = input;
            }
        }
    }
    return query;
}

/**
 * Utility: Generates zipped filters.
 */
function generateZippedFilters(body) {
    const { app, collectionName, collectionKey, key, value } = body;

    const apps = normalizeInput(app);
    const collectionNames = normalizeInput(collectionName);
    const collectionKeys = normalizeInput(collectionKey);
    const keys = normalizeInput(key);
    const values = normalizeInput(value);

    const inputs = [
        { name: 'app', data: apps, original: app },
        { name: 'collectionName', data: collectionNames, original: collectionName },
        { name: 'collectionKey', data: collectionKeys, original: collectionKey },
        { name: 'key', data: keys, original: key },
        { name: 'value', data: values, original: value }
    ].filter(item => item.original !== undefined);

    const lengths = inputs.filter(item => item.data.length > 1).map(item => item.data.length);
    const maxLength = lengths.length > 0 ? Math.max(...lengths) : 1;

    const inconsistent = inputs.some(item => item.data.length > 1 && item.data.length !== maxLength);
    if (inconsistent) {
        throw new Error(`Inconsistent array lengths. All array fields must be length 1 or length ${maxLength}.`);
    }

    let filters = [];

    for (let i = 0; i < maxLength; i++) {
        const filter = {};

        for (const item of inputs) {
            const dataArr = item.data;
            let val;

            if (item.original === null) {
                continue;
            } else if (dataArr.length === 1) {
                val = dataArr[0];
            } else {
                val = dataArr[i];
            }

            filter[item.name] = val;
        }
        filters.push(filter);
    }

    return filters;
}

/**
 * Checks if any access rule in userAccess grants the specific permission (perm)
 * for the given data item (item). 'null' or an empty string in a rule acts as a wildcard ('match all').
 *
 * @param userAccess Array of the user's access rules (objects or legacy arrays).
 * @param item The context of the resource being accessed.
 * @param perm The required permission ('get', 'set', 'remove').
 * @returns boolean - True if permission is granted.
 */
function checkUserPermission(
    userAccess, // Expected: Array of { app, collectionName, key, methods } objects (or legacy arrays)
    item,      // Expected: { app, collectionName, collectionKey } object
    perm       // Expected: string
) {
    
    // Safety check for userAccess being an array
    if (!Array.isArray(userAccess)) {
        return false;
    }

    // Helper to convert the legacy array format into the new object format
    const normalizeAccessRule = (rawAcc) => {
        // 1. If it's already an object (new, correct format), return it.
        if (rawAcc && typeof rawAcc === 'object' && !Array.isArray(rawAcc)) {
            return rawAcc;
        }
        
        // 2. If it's an array of length 4 (old, legacy format), convert it.
        // Array indices: [0]=app, [1]=collectionName, [2]=key, [3]=methods
        if (Array.isArray(rawAcc) && rawAcc.length === 4) {
            return {
                app: rawAcc[0],
                collectionName: rawAcc[1],
                key: rawAcc[2],
                methods: rawAcc[3]
            };
        }
        
        // 3. If it's neither, return a structure that will fail safely.
        return { methods: [] }; 
    };

    // We use .some() to stop and return true the moment a matching rule is found.
    return userAccess.some(rawAcc => {
        
        // Normalize the rule first
        const acc = normalizeAccessRule(rawAcc);

        // This check handles cases where normalization failed (e.g., malformed data)
        if (!acc.methods) { 
            return false;
        }

        // Handle cases where the wildcard might be stored as null or an empty string, or missing property
        const isWildcard = (value) => value === null || value === '' || value === undefined;

        // 1. Check App Match (Wildcard OR Exact Match)
        const appMatch = isWildcard(acc.app) || acc.app === item.app;

        // 2. Check Collection Match (Wildcard OR Exact Match)
        const collectionMatch = isWildcard(acc.collectionName) || acc.collectionName === item.collectionName;

        // 3. Check Key Match (Wildcard OR Exact Match)
        const keyMatch = isWildcard(acc.key) || acc.key === item.collectionKey;

        // 4. Check Permission Match
        const permMatch = Array.isArray(acc.methods) && acc.methods.includes(perm);

        // Access is granted ONLY if ALL levels match (or are wildcard) AND the permission is allowed.
        return appMatch && collectionMatch && keyMatch && permMatch;
    });
}


/**
 * setItem
 */
exports.setItem = async (req, res) => {
    if (!req.user) return res.status(400).json({
        error: 'token expired'
    });
    const userAccess = req.user.access;

    try {
        const combinations = generateZippedFilters(req.body);

        if (combinations.length === 0) {
            return res.status(400).json({
                message: 'All fields (app, collectionName, collectionKey, key, value) must contain values.'
            });
        }

        const denied = [];

        for (const item of combinations) {
            const allowed = checkUserPermission(userAccess, item, "set");

            if (!allowed) {
                denied.push({
                    app: item.app,
                    collection: item.collectionName,
                    key: item.collectionKey
                });
            }
        }

        if (denied.length > 0) {
            return res.status(403).json({
                message: "You do not have 'set' permission for some items.",
                denied
            });
        }

        const bulkOps = combinations.map(filter => ({
            updateOne: {
                filter: {
                    app: filter.app,
                    collectionName: filter.collectionName,
                    collectionKey: filter.collectionKey,
                    key: filter.key
                },
                update: { $set: filter },
                upsert: true
            }
        }));

        const result = await Storage.bulkWrite(bulkOps);

        res.status(200).json({
            message: 'Items saved/updated successfully',
            affected: result.upsertedCount + result.modifiedCount
        });

    } catch (err) {
        console.error('Error in setItem:', err);
        res.status(500).json({
            error: 'Failed to save items',
            details: err.message
        });
    }
};

/**
 * getItem
 */
exports.getItem = async (req, res) => {
    if (!req.user) return res.status(400).json({
        error: 'token expired'
    });
    const userAccess = req.user.access;

    try {
        const body = req.body;
        const arrayFields = ['app', 'collectionName', 'collectionKey', 'key', 'value']
            .filter(f => Array.isArray(body[f]) && body[f].length > 1);

        let filters;

        if (arrayFields.length > 1) {
            filters = generateZippedFilters(body);
        } else {
            const q = buildMongooseQuery(body);
            filters = [q];
        }

        const denied = [];

        for (const item of filters) {
            const permOk = checkUserPermission(userAccess, item, "get");

            if (!permOk) {
                denied.push({
                    app: item.app,
                    collection: item.collectionName,
                    key: item.collectionKey
                });
            }
        }

        if (denied.length > 0) {
            return res.status(403).json({
                message: "You do not have 'get' permission for some items.",
                denied
            });
        }

        let query;

        if (arrayFields.length > 1) {
            query = { $or: filters };
        } else {
            query = filters[0];
        }

        const results = await Storage.find(query).select('app collectionName collectionKey key value -_id');

        const structuredData = {};

        results.forEach(doc => {
            const { app, collectionName, collectionKey, key, value } =
                doc.toObject ? doc.toObject() : doc;

            if (!structuredData[app]) {
                structuredData[app] = {};
            }
            if (!structuredData[app][collectionName]) {
                structuredData[app][collectionName] = {};
            }
            if (!structuredData[app][collectionName]["collectionKey"]) {
                structuredData[app][collectionName]["collectionKey"] = collectionKey;
            }
            structuredData[app][collectionName][key] = value;
        });
        res.status(200).json(structuredData);
            
    } catch (err) {
        console.error('Error in getItem:', err);
        res.status(500).json({
            error: 'Failed to retrieve items',
            details: err.message
        });
    }
};

/**
 * removeItem
 */
exports.removeItem = async (req, res) => {
    if (!req.user) return res.status(400).json({
        error: 'token expired'
    });
    const userAccess = req.user.access;

    try {
        const body = req.body;
        const arrayFields = ['app', 'collectionName', 'collectionKey', 'key', 'value']
            .filter(f => Array.isArray(body[f]) && body[f].length > 1);

        let filters;

        if (arrayFields.length > 1) {
            filters = generateZippedFilters(body);

            if (filters.length === 0) {
                return res.status(400).json({
                    message: 'No valid combinations for removal.'
                });
            }
        } else {
            filters = [buildMongooseQuery(body)];
        }

        const denied = [];

        for (const item of filters) {
            const permOk = checkUserPermission(userAccess, item, "remove");

            if (!permOk) {
                denied.push({
                    app: item.app,
                    collection: item.collectionName,
                    key: item.collectionKey
                });
            }
        }

        if (denied.length > 0) {
            return res.status(403).json({
                message: "You do not have 'remove' permission for some items.",
                denied
            });
        }

        let query;

        if (arrayFields.length > 1) {
            query = { $or: filters };
        } else {
            query = filters[0];
        }

        const result = await Storage.deleteMany(query);

        res.status(200).json({
            message: 'Items removed successfully',
            deletedCount: result.deletedCount
        });

    } catch (err) {
        console.error('Error in removeItem:', err);
        res.status(500).json({
            error: 'Failed to remove items',
            details: err.message
        });
    }
};
