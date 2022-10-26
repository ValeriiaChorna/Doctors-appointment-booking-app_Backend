import supertest from 'supertest';

import { Api } from '../api';

export const fetchSlots = (api: Api): supertest.Test =>
  api.post('').send({
    query: `
      query slots {
        slots {
          doctorId
          start
          end
        }
      }
    `
  });
