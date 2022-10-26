# Appointment Booker

This is the appointment booker assessment which tests your knowledge of the following:

- ORM with PostgreSQL
- Database Migrations
- Dependency Injection
- GraphQL
- Unit Testing
- E2E Testing

Your task:

1. Fix the unit tests
2. Fix the integration tests

<br />

# Setup

```
npm install
```

Spin up a postgres database using docker compose:

```
docker-compose up
```

Watch the dist folder for changes

```
npm run watch
```

Run the built app using nodemon:

```
npm run dev
```

<br/>

# Database

We use TypeORM with code-first migrations.

Migrations can be tricky. If you're unsure, ask for help.

## Generating migrations

1. Ensure your .env file is pointing to your local db and your local db is _up to date_ with the latest set of migrations found in src/database/migrations.
2. Run the command `npm run migration:generate -- migrationName` to generate a migration file.

Note: - migrations are run on startup of the app. If your app restarts automatically due to a new migration file it will run the migration from the 'dist' folder. - IMPORTANT: if you delete a migration, run `npm run clean` so that the migration is removed from your dist folder! Always rollback a migration before deleting it using `migration:reset`.

<br />

# Testing

Run unit tests using:

```
npm run test:unit
```

Run e2e tests (your api must be running) using:

```
npm run test:e2e
```

You can also run tests from VSCode debugger scripts:

- Jest All - to run all tests using debugger
- Jest Current File - to run tests in current open file
