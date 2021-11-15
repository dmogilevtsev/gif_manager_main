ARG NODE_VERSION=16-alpine
FROM node:$NODE_VERSION as builder
WORKDIR /usr
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:$NODE_VERSION
WORKDIR /usr
COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/dist ./dist

CMD node dist/index.js