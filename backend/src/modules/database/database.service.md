# database.service.md

The DatabaseService exposes the methods to interact with the redis database.
Each endpoint has to take into account that:

1. We are using an external lib that may fail
2. We may have a `REDIS_DISABLED` flag set to `true` in the `.env` file

In any of these cases, we have to return a mocked / empty response.
