import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { add } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLaPazDate(): Date {
  return add(new Date(), { hours: -4 });
}
