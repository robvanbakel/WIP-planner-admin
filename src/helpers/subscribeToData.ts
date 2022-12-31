import redis from '../redis';
import { db } from '../firebase';

export default <T>(collection: string): Promise<T[]> => new Promise((resolve) => {
  db.collection(collection).onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as T,
    }));

    redis.set(collection, JSON.stringify(data));

    resolve(data);
  });
});
