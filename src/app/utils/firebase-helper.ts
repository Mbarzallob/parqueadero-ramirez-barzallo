import { Timestamp } from 'firebase/firestore';

export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}
