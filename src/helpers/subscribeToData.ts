import { db } from '../firebase';

export default <T>(collection: string): Promise<T[]> => new Promise((resolve) => {
  db.collection(collection).onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as T,
    }));

    resolve(data);
  });
});
