import { v4 as uuidv4 } from 'uuid';
import dayjs from '../dayjs';
import getCollection from './getCollection';
import { Shift, Admin } from '../types';

export default async (shifts: Shift[]) => {
  const admin = await getCollection <(Admin & { id: string }) >('admin');
  const settings = admin.find((i) => i.id === 'settings');

  if (!settings) return '';

  const { shiftNotes } = settings.shareWithEmployees;
  const { street, postalCode, city } = settings.address;

  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rob van Bakel//Spark//EN';

  shifts.forEach((shift) => {
    icsContent += '\nBEGIN:VEVENT'
    + `\nUID:${uuidv4()}`
    + `\nDTSTAMP:${dayjs().format('YYYYMMDDTHHmmss')}`
    + `\nDTSTART:${dayjs(shift.from).format('YYYYMMDDTHHmmss')}`
    + `\nDTEND:${dayjs(shift.to).format('YYYYMMDDTHHmmss')}`
    + `\nSUMMARY:${shift.location}`
    + `\nDESCRIPTION:${shiftNotes ? shift.notes : ''}`
    + `\nLOCATION:${street}\\n${postalCode} ${city}`
    + '\nEND:VEVENT';
  });

  icsContent += '\nEND:VCALENDAR';

  return icsContent;
};
