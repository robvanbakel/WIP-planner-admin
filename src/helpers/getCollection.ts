import redis from '../redis';

import subscribeToData from './subscribeToData';

export default async <T>(collection: string) => {
  const cached = await redis.get(collection);
  if (cached) return JSON.parse(cached) as T[];

  const initData = await subscribeToData<T>(collection);
  return initData;
};
