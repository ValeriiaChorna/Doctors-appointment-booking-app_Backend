require('dotenv').config();
import { createConnection, ConnectionOptions } from 'typeorm';
import yargs from 'yargs';

import { getTypeOrmConfig } from '../../configure/typeorm.config';

import seedScripts from './scripts';

const dbConnect = async () => {
  const connectionOptions = await getTypeOrmConfig();
  await createConnection(connectionOptions as ConnectionOptions);
  return;
};

const main = async (file: string) => {
  await dbConnect();
  const seedScript = seedScripts[file];
  await seedScript();
  // eslint-disable-next-line no-console
  console.log('\n√ Seed completed\n\nCTRL+C to quit\n');
};

yargs
  .command(
    '$0',
    'seed data from a file',
    {
      file: {
        alias: 'f',
        demandOption: true,
        describe: 'The seed file to run.',
        type: 'string',
      },
    },
    (argv: any) => {
      // eslint-disable-next-line no-console
      console.log('Running with args: ', argv);
      main(argv.file).catch((ex) => {
        // eslint-disable-next-line no-console
        console.log(ex);
      });
    }
  )
  .help().argv;
