# Thought&Function Full-stack assessment

## Instructions

This repo contains two separate projects. This isn't a mono-repo so it's best to open each folder in a separate IDE. We recommend VSCode with prettier and eslint plugins installed.

Both projects contain README files with instructions on how to setup and run locally.

<br />

## Tasks

In this assessment you will build an appointment booking app by fixing the backend code and implementing the frontend code. Authentication has been removed and you can ignore it for this assessment.

<br />

### Task 1 - Fix the backend

The backend contains unit and e2e tests that are failing because the resolver and services haven't been completed. Your task is to implement the resolver and service logic so that the tests pass.

<br />

- 1a. As a user, I can fetch available slots for all doctors

  - Generate slots based on a doctors availability. The date-fns library will help you!
  - Slots should be 15 minutes long
  - You'll need to decide out how best to add doctors to the database for dev and testing purposes

- 1b. As a user, I can book an appointment
  - Slot's can only be booked once

<br />

Read core-api/README.md for instruction on how to setup, run, and add migrations.

<br />

### Task 2 - Implement the frontend

Implement the following user stories by continuing the code started in `src/views/appointments`:

- 2a. As a user, I can view available slots and select one

  - The SlotSelector is there to help you render a calendar and slots and shouldn't need modifying but you can if you want or if there's a problem with it.

- 2b. As a user, I can book an appointment and include details with my booking
  - Use react-hook-form to implement the booking form

<br />

For extra marks, make the UI look pretty.

Read webapp/README.md for instructions on how to run the solution and how to use GraphQL Codegen.

<br />

# Review process

## Uploading your assessment

- push this to your GitHub and add sinn1 as a reviewer
- create a PR for each task where the base is the previous task
- update this README.MD with your total time taken
- 

## Marking

For candidate:
- total time taken:   // please fill this in

- For reviewer 
  - number of backend unit tests passing
  - frontend integrated with api
  - followed existing patterns
  - introduced or improved patterns
  - introduced or improved utils or helpers
  - UI is clean and follows best practices
  - UI implemented following a clear pattern
  - UX decisions follow best practices

