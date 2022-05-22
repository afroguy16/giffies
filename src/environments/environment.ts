import { environment as baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  api: 'jC2UIVIN4zo56OlJS0ogkkp1W3JRb0Q5', //replace with CI secret
};

export const endpoints = {
  search: `${environment.baseURL}/search?api_key=${environment.api}&`,
};
