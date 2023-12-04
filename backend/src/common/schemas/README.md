# Schemas folder

This folder contains the zod schemas.

Zod allows to validate data types on runtime. Is meant to be the **single source of truth** for the parameters, riot api responses, or any other input data.

### Example: `fake-api/:server`

The idea is:

1. The controller defines the endpoint, delegating the validation of `server` to a `serverPipe`
2. The `serverPipe` validates the server against the `serverSchema` exported from this folder
