# GroceCart with Docker

## Start the stack

1. Copy `Backend/.env.example` to `Backend/.env` and replace the placeholder secrets and third-party credentials.
2. From this directory, run:

   ```sh
   docker compose up --build
   ```

3. Open `http://localhost`.

The compose stack runs MongoDB, Redis, the Express/Socket.IO API, and the Vite frontend served by Nginx. Nginx forwards `/api` and `/socket.io` requests to the backend. MongoDB and Redis data are stored in named Docker volumes. The public catalogue is cached in Redis for five minutes and invalidated immediately when an admin changes a product.

## Useful commands

```sh
docker compose logs -f
docker compose down
docker compose down -v # also removes local MongoDB data
```

The backend is private to the Docker network; use the frontend at `http://localhost`, which proxies API and Socket.IO requests securely.
