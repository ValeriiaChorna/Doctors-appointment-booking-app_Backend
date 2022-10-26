require('dotenv').config();

jest.setTimeout(60000);

export default {
  apiUrl: 'http://localhost:8080/graphql',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};
