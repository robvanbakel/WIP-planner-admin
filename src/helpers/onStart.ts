import subscribeToData from './subscribeToData';

export default () => {
  console.log(`Server running on port ${process.env.PORT}`);

  ['admin', 'users', 'shifts'].forEach((collection) => subscribeToData(collection));
};
