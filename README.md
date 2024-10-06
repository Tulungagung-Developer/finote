# Finote Backend

## Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)

## Introduction

Welcome to the Finote Backend repository! This project serves as the backend for the Finote application, providing the necessary functionality to support financial note-taking and organization. This README file will guide you through the installation, usage, and other important details of the Finote Backend.

## Overview

The Finote Backend uses NestJS, a powerful and efficient Node.js framework for building scalable and maintainable server-side applications. It provides a RESTful API that allows the Finote front end to communicate with the backend and perform CRUD operations.

For the database, we are using PostgreSQL, a powerful open-source relational database management system. It is known for its reliability, scalability, and advanced features. To communicate with the database, we use [TypeORM](https://typeorm.io/data-source#what-is-datasource), a popular Object-Relational Mapping (ORM) library for TypeScript and JavaScript. It simplifies database operations and provides a more intuitive and type-safe way to interact with the database.

## Requirements

Before you can run the Finote Backend, make sure you have the following prerequisites installed on your system:

1. Node.js (version 20.15.1 or higher) (this project includes the asdf version manager)
2. Yarn (version 1.22.19 or higher)
3. PostgreSQL (version 15.0 or higher)
4. Email service (e.g., SendGrid, Mailgun, etc.) for sending account verification emails. Or for testing, you can use [Mailtrap](https://mailtrap.io/)
5. Docker (optional, for running the project in a containerized environment)

## Installation

Before proceeding, we assume you have a PostgreSQL database set up and running with a new empty database.

### Local

Follow these steps to install and run the Finote Backend:

1. Clone the repository.
2. Install dependencies using:
   ```bash
   yarn install
   ```
3. Generate a random string to create a cookie secret. Here, we will use the `openssl` command:

   ```bash
   openssl rand -hex 64 | tr -d "\n"
   ```

4. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   TZ=UTC
   NODE_ENV=development # development or production
   DEBUG=false # true or false
   PORT=3000

   COOKIE_SECRET=your_generated_cookie_secret

   SENTRY_DSN=your_sentry_dsn # optional

   DATABASE_HOST=your_database_host
   DATABASE_PORT=your_database_port
   DATABASE_USERNAME=your_database_username
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_finote_database_name

   MAIL_HOST=your_mail_host
   MAIL_USERNAME=your_mail_service_username
   MAIL_PASSWORD=your_mail_service_password
   ```

5. Run the database migrations using:

   ```bash
   yarn migration:run && yarn seed:run
   ```

6. To run the server:

   ```bash
   yarn start
   ```

### Production

We assume that you've been successful with the [Local](#local) section. So we can start to deploy it as the production environment. Follow this step to deploy the Finote Backend:

1. Create a `.env.production` file in the root directory of the project and change the following environment variables:
   ```env
   NODE_ENV=production
   DEBUG=false
   SENTRY_DSN=your_sentry_dsn # optional
   ```
   ⚠️ **Note:** You can change the `DEBUG` variable to `true` if you want to see the debug logs. Also, you can regenerate the `COOKIE_SECRET` variable to make it different from the development environment. Sentry is optional, but it's recommended to use it to catch the errors and exceptions.
2. Run docker build command:
   ```bash
   docker buildx build -f Dockerfile -t finote-backend:latest .
   ```
3. Run docker compose command:

   ```bash
   docker compose --env-file .env -f docker-composer.yaml up -d
   ```

## Contribute

If you'd like to contribute to the Finote Backend, please follow these guidelines:

1. Fork the repository. (please read: [About Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks))
2. Create a new branch for your feature or bug fix.
3. Ensure code quality with linters and formatters.
4. Make your changes and commit them with clear and concise messages, or better, use:
   ```bash
   yarn cz
   ```
5. Push your changes to your forked repository.
6. Submit a pull request to the main repository and explain clearly what you've done.
7. For beginners, look for issues with the `(good first issue)` tag or check the projects tab.
8. Thank you for your contribution!

If you found some issues or have suggestions, please open an issue on the GitHub repository. Before, ensure that your topic isn't duplicated.
