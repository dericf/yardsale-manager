# Yard Sale Manager UI

## Project Demo

[![Demo Video](https://img.youtube.com/vi/w392ms25VhI/0.jpg)](https://www.youtube.com/watch?v=w392ms25VhI)

## Quick Overview

This is a web app that allows users to create sellers and yard sales and then link sellers to different yard sales. The cashier page can be used to add sales of items (transactions) and keep track of all the totals for sellers and yard sales.


## Technologies Used for User Interface

The UI is built with NextJS, TypeScript and Semantic UI React.

Authentication is handled by react-context and custom hooks, combined with JWT Access tokens and refresh tokens.

Database calls (other than anything auth-related) are made to a hosted hasura Postgres/GraphQL database using the JWT token to handle authorization.

## Developing Locally

1. Clone the repository
2. Create a `.env.local` file and add the following env vars
```bash
ENVIRONMENT=dev
NEXT_PUBLIC_API_SERVER_URL=http://127.0.0.1:8000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
```

3. run `npm install`
4. run `npm run dev`

## Future/TODO

1. I need to add Recaptcha protection to the Login, Register, and Forgot Password forms to prevent bots from submitting/creating accounts
2. I need to add more documentation for the database schema, granular permissions, and how someone else could replicate my local database environment using Hasura/Postgres with Docker
3. I also need to add documentation on how I handle database schema and metadata migrations. Hasura makes this fairly easy but it still requires quite a bit of setup.

