const subscribeToData = require('./subscribeToData');
const redis = require('../redis');

const getCollection = async (collection) => {
  const cached = await redis.get(collection);
  if (cached) return JSON.parse(cached);

  const initData = await subscribeToData(collection);
  return initData;
};

module.exports = getCollection;
