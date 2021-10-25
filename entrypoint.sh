# entrypoint.sh

yarn prisma generate
yarn dotenv -e .env.prod yarn prisma migrate deploy
yarn start