import jwtDecode, { JwtPayload } from 'jwt-decode';
import { refresh } from './api/authorization';
import { Tokens } from './types';

let isRefreshing = false;

function isJwtExpired(token: string) {
  const { exp } = jwtDecode<JwtPayload>(token);
  const currentTime = new Date().getTime() / 1000;

  if (exp && currentTime > exp) {
    return true;
  }

  return false;
}

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem('authorizationToken', tokens.authorizationToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const getAuthorizationToken = async (): Promise<string | null> => {
  const authorizationToken = localStorage.getItem('authorizationToken');
  const refreshToken = getRefreshToken();

  if (!authorizationToken || !refreshToken) {
    return null;
  }

  if (isJwtExpired(authorizationToken) && !isRefreshing) {
    isRefreshing = true;

    const newTokens = await refresh({
      authorizationToken,
      refreshToken,
    });

    setTokens(newTokens);
    isRefreshing = false;

    return newTokens.authorizationToken;
  }

  return authorizationToken;
};

export const setRole = (role: string) => {
  localStorage.setItem('role', role);
};

export const getRole = (): string => {
  return localStorage.getItem('role') || '';
};
