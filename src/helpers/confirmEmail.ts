import dotenv from 'dotenv';
import { db } from '../firebase';
import dayjs from '../dayjs';

dotenv.config();

export default async (activationToken: string, email: string) => {
  try {
    // Get UID from activationToken
    const doc = await db.collection('activationTokens').doc(activationToken).get();
    const data = doc.data();

    if (!data) throw new Error();

    const { uid, iat } = data;

    // Check if token is older than 7 days
    if (dayjs().isAfter(dayjs(iat).add(7, 'day'))) {
      return {
        status: 403,
        body: { error: 'Activation token expired' },
      };
    }

    // Get email from user data
    const user = await db.collection('users').doc(uid).get();
    const userData = user.data();

    if (!userData) throw new Error();

    const { email: storedEmail, firstName } = userData;

    if (email === storedEmail) {
      return {
        status: 202,
        body: { firstName },
        uid,
      };
    }
    return {
      status: 403,
      body: { error: 'Incorrect email address' },
    };
  } catch (err) {
    return {
      status: 404,
      body: { error: 'Invalid request' },
    };
  }
};
