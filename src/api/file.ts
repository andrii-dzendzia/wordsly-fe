import fileDownload from 'js-file-download';
import { translatorApi } from './apis';
import { getAuthorizationOptions } from './baseWithAuthorization';

const request = async (url: string, options?: RequestInit): Promise<Blob> => {
  const newOptions = await getAuthorizationOptions(options);

  const response = await fetch(url, newOptions);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.blob();
};

export const downloadFile = async (
  projectId: number,
  targetLangId: number,
  projectName: string,
): Promise<void> => {
  const file = await request(`${translatorApi}/api/Projects/${projectId}/${targetLangId}/file`);

  fileDownload(file, projectName);
};
