# Finote

## Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)

## Introduction

Welcome to the Finote repository! This project providing the necessary functionality to support financial note-taking and organization. This README file will guide you through the installation, usage, and other important details of the Finote Project.

## Overview

This project is a monorepo project that consists of two main components: the Frontend and the Backend. The Frontend is responsible for providing a user-friendly interface for users to create, view, and manage their financial notes. The Backend is responsible for handling data storage, retrieval, and processing.

The Backend uses NestJS, a powerful and efficient Node.js framework for building scalable and maintainable server-side applications. It provides a RESTful API that allows the Finote front end to communicate with the backend and perform CRUD operations.

For the database, we are using PostgreSQL, a powerful open-source relational database management system. It is known for its reliability, scalability, and advanced features. To communicate with the database, we use [TypeORM](https://typeorm.io/data-source#what-is-datasource), a popular Object-Relational Mapping (ORM) library for TypeScript and JavaScript. It simplifies database operations and provides a more intuitive and type-safe way to interact with the database.

## Requirements

Before you can run the Finote Backend, make sure you have the following prerequisites installed on your system:

1. Node.js (version 20.15.1 or higher) (this project includes the asdf version manager)
2. Yarn (version 1.22.19 or higher)
3. PostgreSQL (version 15.0 or higher)
4. Email service (e.g., SendGrid, Mailgun, etc.) for sending account verification emails. Or for testing, you can use [Mailtrap](https://mailtrap.io/)
5. Docker (optional, for running the project in a containerized environment)
6. A Sentry account (optional, for error tracking and monitoring)

## Installation

Before proceeding, we assume you have a PostgreSQL database set up and running with a new empty database. Than, clone the repo (if you wan't contribute better use fork).

```bash
git clone https://github.com/skyjackerz/finote-project.git
cd finote-project
```

After clone please follow bellow instruction.

### Environment Variables

1. Create a `.env` file in the root directory
2. Generate a random string to create a cookie secret. Here, we will use the `openssl` command:

   ```bash
   openssl rand -hex 64 | tr -d "\n"
   ```

   And paste the result to `.env` file as `COOKIE_SECRET`

3. Fill in the `.env` file with the following variables:

   ```env
   TZ=UTC
   NODE_ENV=development # development or production
   DEBUG=true

   COOKIE_SECRET=your_generated_cookie_secret

   SERVER_PORT=3000
   SERVER_SENTRY_DSN=your_server_sentry_dsn # optional

   CLIENT_PORT=3001
   CLIENT_SENTRY_DSN=your_client_sentry_dsn # optional


   DATABASE_HOST=your_database_host
   DATABASE_PORT=your_database_port
   DATABASE_USERNAME=your_database_username
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_finote_database_name

   MAIL_HOST=your_mail_host
   MAIL_USERNAME=your_mail_service_username
   MAIL_PASSWORD=your_mail_service_password
   ```

### Build & Deploy

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Database Migraion:

   ```bash
   yarn server:migration-run
   yarn server:seed-run
   ```

3. Deploying:
   ```bash
   docker compose --env-file .env -f .docker/docker-compose.yml up --build -d
   ```

## Contribute

If you'd like to contribute to the Finote Backend, please follow these guidelines:

1. Fork the repository. (please read: [About Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks))
2. Better to use (git sparse-checkout)[https://git-scm.com/docs/sparse-checkout] for minimize your project data.
3. Create a new branch for your feature or bug fix.
4. Ensure code quality with linters and formatters.
5. Make your changes and commit them with clear and concise messages, or better, use:
   ```bash
   yarn cz
   ```
6. Push your changes to your forked repository.
7. Submit a pull request to the main repository and explain clearly what you've done.
8. For beginners, look for issues with the `(good first issue)` tag or check the projects tab.
9. Thank you for your contribution!

If you found some issues or have suggestions, please open an issue on the GitHub repository. Before, ensure that your topic isn't duplicated.
