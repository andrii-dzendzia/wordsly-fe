import { clientApi } from './apis';
import { request } from './baseWithAuthorization';

export const initCookies = async () : Promise<string> => {
  let quote = sessionStorage.getItem('quote');

  if (quote) {
    return quote;
  }

  quote = await request(`${clientApi}/api/Quota/id`);
  sessionStorage.setItem('quote', quote || '');

  return quote || '';
};

export const sendFileForTranslating = (file: File, quoteId: string) : Promise<void> => {
  const body = new FormData();

  body.append('file', file);
  body.append('quotaId', quoteId);

  return request(`${clientApi}/api/Quota/source-file`, {
    method: 'POST',
    body,
  });
};

export const saveProject = (
  quoteId: string,
  preferences: string | undefined | null,
) : Promise<void> => {
  return request(`${clientApi}/api/Quota/create-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteId,
      preferences,
    }),
  });
};
