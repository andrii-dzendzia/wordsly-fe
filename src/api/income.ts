import { Income, Pricing } from '../types';
import { adminApi } from './apis';
import { request } from './baseWithAuthorization';

export const getIncome = (): Promise<Income> => {
  return request(`${adminApi}/api/Payments`);
};

export const getPrice = (sourceLangId: number, targetLangId: number): Promise<Pricing> => {
  return request(`${adminApi}/api/Payments/pricing?sourceLangId=${sourceLangId}&targetLangId=${targetLangId}`);
};

export const setPrice = (
  pricePerUnitInput: number,
  pricePerUnitOutput: number,
  sourceLanguageId: number,
  targetLanguageId: number,
): Promise<void> => {
  return request(`${adminApi}/api/Payments/pricing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pricePerUnitInput,
      pricePerUnitOutput,
      sourceLanguageId,
      targetLanguageId,
    }),
  });
};
