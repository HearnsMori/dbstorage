//To Do
// Redo all (it is just all a template)
//

const Storage = require('../../models/Storage');

/* =========================================================
   SET KEY ITEM (UPSERT + ACL + DEFAULTS)
========================================================= */

exports.setKeyItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });
    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('setItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   GET KEY ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.getKeyItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('getItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   REMOVE KEY ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.removeKeyItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('removeItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   SET COLLECTION ITEM (UPSERT + ACL + DEFAULTS)
========================================================= */

exports.setCollectionItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('setItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   GET COLLECTION ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.getCollectionItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('getItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   REMOVE COLLECTION ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.removeCollectionItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('removeItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   SET APP ITEM (UPSERT + ACL + DEFAULTS)
========================================================= */

exports.setAppItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('setItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   GET ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.getAppItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('getItem error:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =========================================================
   REMOVE ITEM (ACL STRICT, #all AWARE)
========================================================= */

exports.removeAppItem = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ error: 'token expired' });

    try {
        //check if the required key in body exist
        //if not return error
        //check if exist
        //if exist check if has access
        //if has access allows action on the key
    } catch (err) {
        console.error('removeItem error:', err);
        res.status(500).json({ error: err.message });
    }
};
