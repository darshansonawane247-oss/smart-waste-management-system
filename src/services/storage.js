import { INITIAL_REPORTS, WORKERS, INITIAL_NOTIFICATIONS, DEMO_USERS } from '../data/mockData';

const KEYS = {
  REPORTS: 'swm_reports',
  WORKERS: 'swm_workers',
  NOTIFICATIONS: 'swm_notifications',
  CURRENT_USER: 'swm_current_user'
};

export const getStorageData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const initStorage = () => {
  if (!localStorage.getItem(KEYS.REPORTS)) {
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  }
  if (!localStorage.getItem(KEYS.WORKERS)) {
    localStorage.setItem(KEYS.WORKERS, JSON.stringify(WORKERS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS.citizen));
  }
};

export const resetStorageToDefaults = () => {
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  localStorage.setItem(KEYS.WORKERS, JSON.stringify(WORKERS));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
};

export { KEYS };
