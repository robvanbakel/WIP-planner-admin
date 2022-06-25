const subscribeToData = require('./subscribeToData');

const onStart = async () => {
  console.log(`Server running on port ${process.env.PORT}`);

  ['admin', 'users', 'shifts'].forEach((collection) => subscribeToData(collection));
};

module.exports = onStart;
