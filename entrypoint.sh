# entrypoint.sh
# must use LF (LineFeed) instead of CRLF

yarn prisma generate
yarn dotenv -e .env.prod yarn prisma migrate deploy
yarn start
