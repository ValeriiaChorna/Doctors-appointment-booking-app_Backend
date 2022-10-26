import seedItems from './seedItems';

type SeedScripts = {
  [key: string]: () => void;
};

export default {
  seedItems,
} as SeedScripts;
