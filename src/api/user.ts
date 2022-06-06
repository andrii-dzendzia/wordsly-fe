import {
  LanguagePair,
  PersonalInfo,
  TranslatorInfo,
  User,
  UserProjects,
} from '../types';
import { adminApi } from './apis';
import { request } from './baseWithAuthorization';

export const getUser = (): Promise<User> => {
  return request(`${adminApi}/api/Users`);
};

export const getProjectsInfo = (): Promise<UserProjects> => {
  return request(`${adminApi}/api/Users/projects-info`);
};

export const getPersonalInfo = (): Promise<PersonalInfo> => {
  return request(`${adminApi}/api/Users/personal-info`);
};

export const updateName = (firstname: string, lastname: string): Promise<User> => {
  return request(`${adminApi}/api/Users/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname,
      lastname,
    }),
  });
};

export const updatePersonalInfo = (website: string, company: string): Promise<PersonalInfo> => {
  return request(`${adminApi}/api/Users/personal-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      website,
      company,
    }),
  });
};

export const updateEmail = (email: string): Promise<User> => {
  return request(`${adminApi}/api/Users/email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
};

export const updatePassword = (oldPassword: string, newPassword: string): Promise<void> => {
  return request(`${adminApi}/api/Users/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });
};

export const getTranslatorInfo = (): Promise<TranslatorInfo> => {
  return request(`${adminApi}/api/Users/translator-info`);
};

export const updateTranslatorInfo = (
  subjectIds: number[],
  languagesPairs: LanguagePair[],
): Promise<TranslatorInfo> => {
  return request(`${adminApi}/api/Users/translator-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subjectIds,
      languagesPairs,
    }),
  });
};
