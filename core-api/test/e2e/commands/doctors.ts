import supertest from "supertest";

import { Api } from "../api";

export const fetchSlots = (api: Api, from: Date, to: Date): supertest.Test =>
  api.post("").send({
    query: `
      query slots ($to: DateTime!, $from: DateTime!) {
        slots (to: $to, from: $from) {
          doctorId
          start
          end
        }
      }
    `,
    variables: {
      from,
      to,
    },
  });
