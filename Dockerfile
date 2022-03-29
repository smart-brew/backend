FROM node:14-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn prisma generate
RUN yarn build
ENTRYPOINT ["/bin/sh", "./entrypoint.sh" ]