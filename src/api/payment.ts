import { clientApi } from './apis';
import { request } from './baseWithAuthorization';

export const payment = (projectId: number, nonce: string): Promise<void> => {
  return request(`${clientApi}/api/Quota`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectId,
      nonce,
    }),
  });
};
