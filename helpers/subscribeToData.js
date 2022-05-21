const redis = require('../redis');
const { db } = require('../firebase');

const subscribeToData = (collection) => new Promise((resolve) => {
  db.collection(collection).onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    redis.set(collection, JSON.stringify(data));

    resolve(data);
  });
});

module.exports = subscribeToData;
