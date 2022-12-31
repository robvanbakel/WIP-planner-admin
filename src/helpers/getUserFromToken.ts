import { auth } from '../firebase';
import { User } from '../types';

import getCollection from './getCollection';

export default async (token: string) => {
  try {
    const { uid } = await auth.verifyIdToken(token);
    const users = await getCollection<User>('users');

    return users.find((user) => user.id === uid);
  } catch {
    return null;
  }
};
