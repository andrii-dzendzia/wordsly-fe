import { Subject } from '../types';
import { adminApi } from './apis';
import { request } from './baseWithAuthorization';

export const getSubjects = async (): Promise<Subject[]> => {
  return request(`${adminApi}/api/Subjects`);
};
