const { auth } = require('../firebase');

const getCollection = require('./getCollection');

const getUserFromToken = async (token) => {
  try {
    const { uid } = await auth.verifyIdToken(token);
    const users = await getCollection('users');

    return users.find((user) => user.id === uid);
  } catch {
    return null;
  }
};

module.exports = getUserFromToken;
