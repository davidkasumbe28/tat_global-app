import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TimeRange } from '../@types/enums';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

