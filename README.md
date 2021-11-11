# Backend

## Startup

```bash
docker compose up --build --detach
```

## Deploy

Handled using Github Actions (more info: `/.github/workflows/update.yml`)

After push on `main`, automatically connect to Raspberry Pi via SSH and execute following script:

```bash
cd /home/pi/backend
git pull
docker-compose build
docker-compose up --detach
```

## Development

Please USE `yarn`, instead of `npm`

Start with hot-reload:

```bash
yarn dev
```
