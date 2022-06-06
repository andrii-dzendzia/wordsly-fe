import { Result } from '../types';

export const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);

  try {
    const result: Result<T> = await response.json();

    if (result.isSuccess) {
      return result.data;
    }

    throw new Error(result.errorMessage);
    // eslint-disable-next-line
  } catch (e: any) {
    if (e.message === 'The refresh token is not valid.') {
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }

    throw e;
  }
};
