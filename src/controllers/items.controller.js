// Example resource showing the full pattern end to end: public list/read,
// auth-protected write operations, pagination on the list endpoint. Rename
// or delete this once you have real resources — keep the shape.

const {
  createItem,
  listItems,
  findItemById,
  updateItem,
  deleteItem,
} = require("../models/item.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getItems = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const offset = Number(req.query.offset) || 0;
  const page = await listItems({ limit, offset });
  res.status(200).json({ success: true, data: page });
});

const getItem = asyncHandler(async (req, res) => {
  const item = await findItemById(req.params.id);
  if (!item) throw new ApiError(404, "Item not found.");
  res.status(200).json({ success: true, data: item });
});

const postItem = asyncHandler(async (req, res) => {
  const item = await createItem({ name: req.body.name, ownerId: req.user.id });
  res.status(201).json({ success: true, data: item });
});

const putItem = asyncHandler(async (req, res) => {
  const item = await updateItem(req.params.id, { name: req.body.name });
  if (!item) throw new ApiError(404, "Item not found.");
  res.status(200).json({ success: true, data: item });
});

const removeItem = asyncHandler(async (req, res) => {
  const deleted = await deleteItem(req.params.id);
  if (!deleted) throw new ApiError(404, "Item not found.");
  res.status(204).send();
});

module.exports = { getItems, getItem, postItem, putItem, removeItem };
