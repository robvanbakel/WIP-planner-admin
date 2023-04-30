import dotenv from 'dotenv';

import nodemailer from '../../nodemailer';
import base from './base';

import getCollection from '../getCollection';
import { User } from '../../types';

dotenv.config();

type To = { email: string, firstName: string } | string;

export default async (to: To, subject: string, html: string) => {
  let receiver = to;

  if (typeof receiver === 'string') {
    const users = await getCollection<User>('users');
    const foundUser = users.find((user) => user.id === receiver);

    if (!foundUser) return;

    receiver = foundUser;
  }

  await nodemailer.sendMail({
    from: 'Spark <info@sparkscheduler.com>',
    to: receiver.email,
    subject,
    html: base({
      firstName: receiver.firstName,
      body: html,
    }),
  });
};
