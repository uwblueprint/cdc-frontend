# Getting Started (Contributors Only)

1. Clone this repo and the backend repo (cdc-backend)
2. Grab the secrets
3. todo: continued steps to get project set up locally

---

# About Calgary Distress Center

todo

# Team

Project Lead: [Ahmed Hamodi](https://github.com/ahmedhamodi)\
Product Manager: [Aaron Abraham](https://github.com/aaronabraham311)\
Designers: [Jack Zhang](https://github.com/fakesquid), [Kouthar Waled](https://github.com/kouthar)\
Developers: [Jay Dhulia](https://github.com/jaydhulia), [Dhruvin Balar](https://github.com/drbalar), [Amolik Singh](https://github.com/amoliksingh), [Vivian Liu](https://github.com/vivianliu0), [Kevin Hu](https://github.com/andstun)

---

# Local Development Setup

## Secrets

In the root directory, copy the .env.example file into .env and request the secrets from the Project Lead.

## Frontend

### Dependencies

On a fresh clone of the repository, you need to run `npm install` to install the necessary dependencies for the frontend code.

When you pull in changes from master to your local repository and you see changes to `package.json`, that is also an indication that you need to run `npm install` before running the code.

### Adding dependencies

Once you find a helper library that you wish to use, you can install it via `npm install <name-of-package>`. This will modify the package.json and package-lock.json files.

For example, to install the eslint-plugin-prettier package, run:

```
npm install eslint-plugin-prettier
```

Please ensure to include changes to this file in your pull request.

### Node version

To minimize unexpected behaviours, please ensure you are using node v14.16.0. Can find a link to the installation [here](https://nodejs.org/en/download/).

### Running code

To run the frontend code, you can run the following in the root directory:

```
npm run start
```

This runs the frontend in development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Admin account

We have a test account for everyone to use (unless you wish to make an account yourself, which is also fine).

The email is: `distresscenter@test.org`. Reach out to the project lead for the password.

## Backend

See cdc-backend for backend setup.

# Deployment

Deployment is done through Netlify.

It can be found [here](https://admin-dev.jaydhulia.com/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/e3c6d294-8df3-4841-b171-7d5e5782d9ec/deploy-status)](https://app.netlify.com/sites/distresscenter/deploys)
