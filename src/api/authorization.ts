import { Tokens, SignUpModel } from '../types';
import { clientApi } from './apis';
import { request } from './base';

export const signIn = async (email: string, password: string): Promise<Tokens> => {
  return request(`${clientApi}/api/Auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const signUp = async (signUpModel: SignUpModel): Promise<Tokens> => {
  return request(`${clientApi}/api/Auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signUpModel),
  });
};

export const refresh = async (tokens: Tokens): Promise<Tokens> => {
  return request(`${clientApi}/api/Auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokens),
  });
};
