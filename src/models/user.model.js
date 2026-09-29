// No database wired yet, so this is an in-memory stand-in — just enough for
// sign-up/sign-in to actually work while you build the rest of the app.
// Swap this file's internals for a real schema (Mongoose/Prisma/Sequelize)
// later; keep the same three function names so nothing above this layer
// has to change.
//
// Shape once persisted for real:
//   { id, name, email, passwordHash, createdAt }

const users = [];
let nextId = 1;

async function createUser({ name, email, passwordHash }) {
  const user = { id: nextId++, name, email, passwordHash, createdAt: new Date() };
  users.push(user);
  return user;
}

async function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

async function findUserById(id) {
  return users.find((u) => u.id === Number(id)) || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
