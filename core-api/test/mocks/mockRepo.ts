import { Repository } from "typeorm";

const createMockRepo = (mockRepository: Partial<Repository<any>>) => {
  return {
    has: () => true,
    get: () => ({
      getRepository: (name: string) => {
        console.log(name);
        return {
          mockRepository,
        };
      },
    }),
  };
};

export default createMockRepo;