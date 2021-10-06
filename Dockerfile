FROM node:latest
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY ./ ./
EXPOSE 8000
CMD [ "node", "server.js" ]