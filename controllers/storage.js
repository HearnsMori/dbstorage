const Storage = require('../models/Storage');

/* =========================================================
   HELPERS
========================================================= */

const exactSetKeyFilter = ({ app, collectionName, collectionKey, key }) => {
    return ({
        app,
        collectionName,
        collectionKey,
        key
    });
};

const exactGetKeyFilter = ({ app, collectionName, collectionKey, key, value }) => {
    return {
        ...(app != null ? { app } : {}),
        ...(collectionName != null ? { collectionName } : {}),
        ...(collectionKey != null ? { collectionKey } : {}),
        ...(key != null ? { key } : {}),
        ...(value != null ? { value } : {}),
    };
};


/**
 * ACL CHECK
 * '#all' → always allowed
 * otherwise → userId must be present
 */
const hasAccess = (doc, userId, type) => {
    if (!doc) return false;

    const list =
        type === 'get'
            ? doc.getAccess
            : type === 'set'
                ? doc.setAccess
                : doc.removeAccess;

    if (!Array.isArray(list)) return false;
    if (list.includes('#all')) return true;
    return list.includes(userId);
};

/* =========================================================
   ZIP ARRAY → OBJECT COMBINATIONS
========================================================= */

function toArray(v) {
    if (v === undefined) return undefined;
    return Array.isArray(v) ? v : [v];
}

function normalizeACL(v) {
    if (v === undefined) return undefined;
    return Array.isArray(v) ? v : [v];
}

function generateZipped(body) {
    const fields = [
        'app',
        'collectionName',
        'collectionKey',
        'key',
        'value',
        'getAccess',
        'setAccess',
        'removeAccess',
    ];

    const arrays = {};
    let max = 1;

    // Normalize to arrays & find max length
    for (const f of fields) {
        arrays[f] = toArray(body[f]);
        if (arrays[f]?.length > max) max = arrays[f].length;
    }

    const items = [];

    for (let i = 0; i < max; i++) {
        const item = {};

        for (const f of fields) {
            if (!arrays[f]) continue;

            const src = arrays[f];
            let val = src[i] ?? src[0];

            // ACL fields must ALWAYS be arrays
            if (['getAccess', 'setAccess', 'removeAccess'].includes(f)) {
                val = normalizeACL(val);
            }

            item[f] = val;
        }

        items.push(item);
    }
    console.log('Generated zipped items:', items);
    return items;
}


/* =========================================================
   SET ITEM (UPSERT + ACL + DEFAULTS)
========================================================= */

exports.setItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        const items = generateZipped(req.body);
        if (!items.length)
            return res.status(400).json({ error: 'No valid items' });

        const denied = [];
        const ops = [];

        for (const item of items) {
            const filter = exactSetKeyFilter(item);
            const existing = await Storage.findOne(filter);

            // ACL check for existing item
            if (existing && !hasAccess(existing, req.user.id, 'set')) {
                denied.push(filter);
                continue;
            }

            const userId = req.user.id;

            ops.push({
                updateOne: {
                    filter,
                    update: {
                        $set: {
                            ...item,

                            // DEFAULT ACL BEHAVIOR
                            getAccess: item.getAccess ?? ['#all'],
                            setAccess: item.setAccess ?? [userId],
                            removeAccess: item.removeAccess ?? [userId],
                        },
                    },
                    upsert: true,
                },
            });
        }

        if (denied.length) {
            return res.status(403).json({
                message: 'Set access denied',
                denied,
            });
        }

        const result = await Storage.bulkWrite(ops);

        res.json({
            message: 'Items saved',
            affected: result.upsertedCount + result.modifiedCount,
        });
    } catch (err) {
        console.error('setItem error:', err);
        res.status(500).json({ error: err.message });
    }
};


function generateZippedGet(body) {
    const fields = [
        'app',
        'collectionName',
        'collectionKey',
        'key',
        'value'
    ];

    const arrays = {};
    let max = 1;

    // Normalize to arrays & find max length
    for (const f of fields) {
        arrays[f] = toArray(body[f]);
        if (arrays[f]?.length > max) max = arrays[f].length;
    }

    const items = [];

    for (let i = 0; i < max; i++) {
        const item = {};

        for (const f of fields) {
            if (!arrays[f]) continue;

            const src = arrays[f];
            let val = src[i] ?? src[0];

            item[f] = val;
        }

        items.push(item);
    }
    console.log('Generated zipped items:', items);
    return items;
}

/* =========================================================
   GET ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.getItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        const filters = generateZippedGet(req.body).map(exactGetKeyFilter);
        console.log(filters);
        const docs = await Storage.find(
            filters.length > 1 ? { $or: filters } : filters[0]
        );

        const accepted = docs.filter(
            (doc) => hasAccess(doc, req.user.id, 'get')
        );

        console.log('Accepted docs:', accepted);

        const output = {};

        accepted.forEach(({ app, collectionName, collectionKey, key, value }) => {
            if (!output[app]) output[app] = {};
            if (!output[app][collectionName]) output[app][collectionName] = { collectionKey };
            // Keep existing keys, add new key
            output[app][collectionName][key] = value;
        });


        console.log('getItem output:', output);

        res.json(output);
    } catch (err) {
        console.error('getItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   REMOVE ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.removeItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        const filters = generateZipped(req.body).map(exactGetKeyFilter);

        const docs = await Storage.find(
            filters.length > 1 ? { $or: filters } : filters[0]
        );

        docs.forEach(doc => {
            if (hasAccess(doc, req.user.id, 'remove')) {
                Storage.deleteOne({ _id: doc._id }).exec();
            } else {
                console.log('Not authorized to remove:', doc);
            }
        });

        res.json({
            message: 'Items removed'
        });
    } catch (err) {
        console.error('removeItem error:', err);
        res.status(500).json({ error: err.message });
    }
};
