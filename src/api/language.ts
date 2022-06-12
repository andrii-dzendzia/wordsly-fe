import { Language } from '../types';
import { adminApi } from './apis';
import { request } from './baseWithAuthorization';

export const getLanguages = async (): Promise<Language[]> => {
  return request(`${adminApi}/api/Languages`);
};

export const changeLanguageStatus = (langId: number): Promise<void> => {
  return request(`${adminApi}/api/Languages/${langId}`, {
    method: 'PUT',
  });
};
