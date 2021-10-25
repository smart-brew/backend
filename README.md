# backend

After push on `main`, automatically connect to Raspberry Pi via SSH and execute folloving script:

```bash
cd /home/pi/backend
git pull
ls -la
docker-compose build
docker-compose up
```

## Development

Please USE `yarn`, instead of `npm`

Start with hot-reload:

```bash
yarn dev
```
