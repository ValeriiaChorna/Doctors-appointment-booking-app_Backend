import supertest from 'supertest';

import config from './config';

type Methods = 'post' | 'get' | 'put' | 'delete';

export class Api {
  private token: string;

  private hook(method: Methods = 'post') {
    return (args: any) =>
      supertest(config.apiUrl)
        [method](args)
        .set('Authorization', `${this.token}`);
  }

  public post: (args: any) => any;

  public get: (args: any) => any;

  public put: (args: any) => any;

  public delete: (args: any) => any;

  constructor() {
    this.post = this.hook('post');
    this.get = this.hook('get');
    this.put = this.hook('put');
    this.delete = this.hook('delete');
  }

  setToken = (input: string): void => {
    this.token = input;
  };
}

export const createApi = (): Api => new Api();

export const adminApi = new Api();
