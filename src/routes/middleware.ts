import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';
import dayjs from '../dayjs';

import getUserFromToken from '../helpers/getUserFromToken';

export const demoGuard: RequestHandler = async (req, res, next) => {
  if (req.method === 'GET') {
    next();
    return;
  }

  const user = await getUserFromToken(req.headers.authorization as string);

  if (user?.demo) {
    res.send('No data will be saved in the demo environment');
    return;
  }

  next();
};

export const adminOnly: RequestHandler = async (req, res, next) => {
  const user = await getUserFromToken(req.headers.authorization as string);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (user.status !== 'ADMIN') {
    res.status(403).end();
    return;
  }

  next();
};

export const logger: RequestHandler = (req, res, next) => {
  if (req.method === 'GET' && ['/admin/db/settings', '/admin/db/users', '/admin/db/shifts'].includes(req.originalUrl)) {
    next();
    return;
  }

  fs.appendFile(
    path.join(process.env.LOGS_DIRECTORY as string, `${dayjs().format('YYYY-MM-DD')}.log`),
    `${dayjs().format('YYYY-MM-DD HH:mm:ss Z')}\n${req.method} ${req.originalUrl}\n${['POST', 'PATCH'].includes(req.method) ? `${JSON.stringify(req.body)}\n` : ''}\n`,
    next,
  );
};
