# entrypoint.sh
# must use LF (LineFeed) instead of CRLF

yarn prisma generate
yarn prisma migrate deploy
yarn start

