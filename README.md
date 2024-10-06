# Finote Backend

## Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)

## Introduction

Welcome to the Finote Backend repository! This project serves as the backend for the Finote application, providing the necessary functionality to support financial note-taking and organization. This README file will guide you through the installation, usage, and other important details of the Finote Backend.

## Overview

The Finote Backend is built using NestJS, a powerful and efficient Node.js framework for building scalable and maintainable server-side applications. It provides a RESTful API that allows the Finote frontend to communicate with the backend and perform CRUD operations on notes.

For the database, we are using PostgreSQL, a powerful open-source relational database management system. It is known for its reliability, scalability, and advanced features. To communicate with the database, we are using TypeORM, a popular Object-Relational Mapping (ORM) library for TypeScript and JavaScript. It simplifies database operations and provides a more intuitive and type-safe way to interact with the database.

## Requirements

Before you can run the Finote Backend, make sure you have the following prerequisites installed on your system:

1. Node.js (version 20.15.1 or higher) (this project includes the asdf version manager)
2. PostgreSQL (version 15.0 or higher)
3. Yarn (version 1.22.19 or higher)

## Installation

Before proceeding, we assuem that you have a PostgreSQL database set up and running with new empty database.

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
   yarn migration:run
   yarn seed:run
   ```

6. To run the server:

   ```bash
   yarn start
   ```

## Contribute

If you'd like to contribute to the Finote Backend, please follow these guidelines:

1. Fork the repository.
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

If you found some issues or have suggestions, please open an issue on the GitHub repository. Before that ensure that your issue isn't duplicated.
