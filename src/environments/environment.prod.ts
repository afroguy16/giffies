import { environment as baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
};

export const endpoints = {
  search: `${environment.baseURL}/search?api_key=${environment.api}&`,
};
