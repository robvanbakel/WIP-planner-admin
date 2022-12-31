const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

export default (length: number): string => Array(length)
  .fill(true)
  .map(() => chars[Math.floor(Math.random() * chars.length)])
  .join('');
