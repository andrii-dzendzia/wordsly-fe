import { getAuthorizationToken } from '../tokenHandler';
import { request as baseRequest } from './base';

export const getAuthorizationOptions = async (options?: RequestInit)
: Promise<RequestInit | undefined> => {
  const token = await getAuthorizationToken();

  if (!token) {
    return options;
  }

  if (options) {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const newOptions = await getAuthorizationOptions(options);

  return baseRequest(url, newOptions);
};
