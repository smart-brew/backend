FROM node:14
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn prisma generate
RUN yarn build
ENTRYPOINT ["/bin/bash", "./entrypoint.sh" ]