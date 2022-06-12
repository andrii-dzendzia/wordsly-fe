import { Subject } from '../types';
import { adminApi } from './apis';
import { request } from './baseWithAuthorization';

export const getSubjects = async (): Promise<Subject[]> => {
  return request(`${adminApi}/api/Subjects`);
};

export const deleteSubject = (subjectId: number): Promise<void> => {
  return request(`${adminApi}/api/Subjects/${subjectId}`, {
    method: 'DELETE',
  });
};

export const addSubject = (text: string): Promise<void> => {
  return request(`${adminApi}/api/Subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  });
};
