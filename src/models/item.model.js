// Same idea as user.model.js: an in-memory placeholder standing in for a
// real table/collection. "items" is just an example resource showing the
// route -> controller -> model shape — rename or delete it once you have
// real resources.
//
// Shape once persisted for real:
//   { id, ownerId, name, createdAt }

const items = [];
let nextId = 1;

async function createItem({ name, ownerId }) {
  const item = { id: nextId++, name, ownerId, createdAt: new Date() };
  items.push(item);
  return item;
}

async function listItems({ limit = 10, offset = 0 } = {}) {
  return {
    total: items.length,
    limit,
    offset,
    results: items.slice(offset, offset + limit),
  };
}

async function findItemById(id) {
  return items.find((i) => i.id === Number(id)) || null;
}

async function updateItem(id, updates) {
  const item = await findItemById(id);
  if (!item) return null;
  Object.assign(item, updates);
  return item;
}

async function deleteItem(id) {
  const index = items.findIndex((i) => i.id === Number(id));
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

module.exports = { createItem, listItems, findItemById, updateItem, deleteItem };
