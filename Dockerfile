FROM node:16-alpine as builder
WORKDIR /usr
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -la
CMD node src/index.js

# stage 2
# FROM node:16-alpine
# WORKDIR /usr
# COPY package*.json ./
# RUN npm install --production

# COPY --from=builder /usr/dist ./dist

# CMD node dist/index.js