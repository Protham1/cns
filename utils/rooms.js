const users = [];

function addUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function removeUser(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUsersInRoom(room) {
  return users.filter((u) => u.room === room);
}

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom
};