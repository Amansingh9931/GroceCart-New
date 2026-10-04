# GroceCart with Docker

## Start the stack

1. Copy `Backend/.env.example` to `Backend/.env` and replace the placeholder secrets and third-party credentials.
2. From this directory, run:

   ```sh
   docker compose up --build
   ```

3. Open `http://localhost`.

The compose stack runs MongoDB, the Express/Socket.IO API, and the Vite frontend served by Nginx. Nginx forwards `/api` and `/socket.io` requests to the backend. MongoDB data is stored in the named `mongo_data` volume.

## Useful commands

```sh
docker compose logs -f
docker compose down
docker compose down -v # also removes local MongoDB data
```

The backend is also exposed at `http://localhost:8000` for direct API debugging.
