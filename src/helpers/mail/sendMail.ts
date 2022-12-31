import dotenv from 'dotenv';

import sgMail from '@sendgrid/mail';
import base from './base';

import getCollection from '../getCollection';
import { User } from '../../types';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY as string);

type To = { email: string, firstName: string } | string;

export default async (to: To, subject: string, html: string) => {
  let receiver = to;

  if (typeof receiver === 'string') {
    const users = await getCollection<User>('users');
    const foundUser = users.find((user) => user.id === receiver);

    if (!foundUser) return;

    receiver = foundUser;
  }

  sgMail.send({
    from: {
      email: 'info@sparkscheduler.com',
      name: 'Spark',
    },
    to: receiver.email,
    subject,
    html: base({
      firstName: receiver.firstName,
      body: html,
    }),
  });
};
