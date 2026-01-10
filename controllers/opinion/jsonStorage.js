const Storage = require('../../models/Storage');

/* =========================================================
   HELPERS
========================================================= */

const keyFilter = ({ app, collectionName, collectionKey, key }) => ({
  app,
  collectionName,
  collectionKey,
  key,
});

const hasAccess = (doc, userId, type) => {
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

const safeParse = (v) => {
  try {
    return typeof v === 'string' ? JSON.parse(v) : {};
  } catch {
    return {};
  }
};

/* =========================================================
   GET JSON ITEM
========================================================= */

exports.getJSONItem = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({ error: 'token expired' });

  const filter = keyFilter(req.body);
  const doc = await Storage.findOne(filter);

  if (!doc || !hasAccess(doc, req.user.id, 'get'))
    return res.json({});

  res.json(safeParse(doc.value));
};

/* =========================================================
   SET JSON ITEM (OVERWRITE)
========================================================= */

exports.setJSONItem = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({ error: 'token expired' });

  const filter = keyFilter(req.body);
  const json = req.body.value;

  if (typeof json !== 'object')
    return res.status(400).json({ error: 'value must be object' });

  const existing = await Storage.findOne(filter);
  if (existing && !hasAccess(existing, req.user.id, 'set'))
    return res.status(403).json({ error: 'set access denied' });

  await Storage.updateOne(
    filter,
    {
      $set: {
        ...filter,
        value: JSON.stringify(json),
        getAccess: existing?.getAccess ?? ['#all'],
        setAccess: existing?.setAccess ?? [req.user.id],
        removeAccess: existing?.removeAccess ?? [req.user.id],
      },
    },
    { upsert: true }
  );

  res.json({ message: 'json saved' });
};

/* =========================================================
   PUSH JSON KEY
   body.value = { someKey: any }
========================================================= */

exports.pushJSONItem = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({ error: 'token expired' });

  const filter = keyFilter(req.body);
  const patch = req.body.value;

  if (!patch || typeof patch !== 'object')
    return res.status(400).json({ error: 'value must be object' });

  const doc = await Storage.findOne(filter);

  if (doc && !hasAccess(doc, req.user.id, 'set'))
    return res.status(403).json({ error: 'set access denied' });

  const base = doc ? safeParse(doc.value) : {};
  const merged = { ...base, ...patch };

  await Storage.updateOne(
    filter,
    {
      $set: {
        ...filter,
        value: JSON.stringify(merged),
        getAccess: doc?.getAccess ?? ['#all'],
        setAccess: doc?.setAccess ?? [req.user.id],
        removeAccess: doc?.removeAccess ?? [req.user.id],
      },
    },
    { upsert: true }
  );

  res.json({ message: 'key pushed' });
};

/* =========================================================
   POP JSON KEY
   body.value = "keyToRemove"
========================================================= */

exports.popJSONItem = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({ error: 'token expired' });

  const filter = keyFilter(req.body);
  const popKey = req.body.value;

  if (typeof popKey !== 'string')
    return res.status(400).json({ error: 'value must be key string' });

  const doc = await Storage.findOne(filter);
  if (!doc || !hasAccess(doc, req.user.id, 'remove'))
    return res.status(403).json({ error: 'remove access denied' });

  const json = safeParse(doc.value);
  delete json[popKey];

  await Storage.updateOne(
    filter,
    { $set: { value: JSON.stringify(json) } }
  );

  res.json({ message: 'key removed' });
};

/* =========================================================
   REMOVE JSON STORE (DELETE DOC)
========================================================= */

exports.removeJSONItem = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({ error: 'token expired' });

  const filter = keyFilter(req.body);
  const doc = await Storage.findOne(filter);

  if (!doc || !hasAccess(doc, req.user.id, 'remove'))
    return res.status(403).json({ error: 'remove access denied' });

  await Storage.deleteOne({ _id: doc._id });

  res.json({ message: 'json store removed' });
};
