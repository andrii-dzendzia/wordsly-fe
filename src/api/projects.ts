import {
  PaginationResult,
  ProjectInfo,
  StringComment,
  StringModel,
  Project,
} from '../types';
import { ProjectStatus } from '../enums';
import { translatorApi } from './apis';
import { request } from './baseWithAuthorization';

export const getProjectStrings = (
  id: string,
  lang: string,
  page: number,
) : Promise<PaginationResult<StringModel>> => {
  return request(`${translatorApi}/api/Projects/${id}/${lang}/${page}`);
};

export const getProjectString = (
  id: string,
  lang: number,
  stringId: number,
) : Promise<StringModel> => {
  return request(`${translatorApi}/api/Projects/${id}/${lang}/strings/${stringId}`);
};

export const getProjectInfo = (
  id: string,
  lang: string,
) : Promise<ProjectInfo> => {
  return request(`${translatorApi}/api/Projects/${id}/${lang}`);
};

export const getComments = (stringId: number, lang: number) : Promise<StringComment[]> => {
  return request(`${translatorApi}/api/Projects/${stringId}/${lang}/comments`);
};

export const sendComment = (stringId: number, lang: number, text: string) : Promise<void> => {
  return request(`${translatorApi}/api/Projects/${stringId}/${lang}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  });
};

export const sendProjectString = (
  id: string,
  lang: number,
  stringId: number,
  text: string,
) : Promise<void> => {
  return request(`${translatorApi}/api/Projects/${id}/${lang}/strings/${stringId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  });
};

export const approveProject = (id: number, lang: number) : Promise<void> => {
  return request(`${translatorApi}/api/Projects/${id}/${lang}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getProjects = (projectStatus: ProjectStatus): Promise<Project[]> => {
  return request(`${translatorApi}/api/Projects?status=${projectStatus}`);
};

export const getAvailableProjects = (
  subjectId: number,
  sourceLangId: number,
  targetLangId: number,
): Promise<Project[]> => {
  return request(`${translatorApi}/api/Projects/active?subjectId=${subjectId}&sourceLangId=${sourceLangId}&targetLangId=${targetLangId}`);
};

export const joinProject = (projectId: number, targetLangId: number): Promise<void> => {
  return request(`${translatorApi}/api/Projects/${projectId}/${targetLangId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
