# GIF MANAGER APP

1. First step - create folder with project and add `.env` file with variables:

```bash
# DB env
DB_USERNAME=admin
DB_PASSWORD=root
DB_DATABASENAME_AUTH=gif_manager_auth
DB_DATABASENAME_MAIN=gif_manager_main
DB_PORT=5432
DB_HOST=db
DB_TYPE=postgres

# node_auth
API_PORT_NODE_AUTH=3001
API_HOST_NODE_AUTH=http://localhost:
CLIENT_URL=http://localhost:3000
# JWT environment
JWT_ACCESS_SECRET=ce996c86-9b22-42cb-be91-b4a50c3fb02a
JWT_ACCESS_EXPIRESIN=1m
JWT_REFRESH_SECRET=af0dd4e5-03e1-4028-9170-a2e8ef09a995
JWT_REFRESH_EXPIRESIN=30d
# SMTP environment
SMTP_USER=###
SMTP_PASSWORD=###
SMTP_HOST=###
SMTP_PORT=###

# gif_manager_main environment
API_HOST_MAIN=http://localhost:
API_PORT_MAIN=3002

# gif_manager_client environment
API_HOST_CLIENT=http://localhost:
API_PORT_CLIENT=3000
AUTH_HOST_MAIN=auth
```

2. Create `docker-compose.yml`

```dockerfile
version: '3.7'

services:
  db:
    container_name: postgres
    image: postgres:14.0-alpine
    restart: always
    environment:
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_MULTIPLE_DATABASES=${DB_DATABASENAME_AUTH},${DB_DATABASENAME_MAIN}
    volumes:
      - ./pgdata:/var/lib/postgresql/data
      - ./initdb.sh:/docker-entrypoint-initdb.d/initdb.sh
    ports:
      - ${DB_PORT}:${DB_PORT}
    networks:
      - app
  auth:
    container_name: auth
    build:
      context: ./node_auth
    depends_on:
      - db
    restart: always
    ports:
      - ${API_PORT_NODE_AUTH}:${API_PORT_NODE_AUTH}
    expose:
      - ${API_PORT_NODE_AUTH}
    environment:
      # base env
      - API_PORT_NODE_AUTH=${API_PORT_NODE_AUTH}
      - API_HOST_NODE_AUTH=${API_HOST_NODE_AUTH}
      - CLIENT_URL=${CLIENT_URL}
      # db env
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_DATABASENAME_AUTH=${DB_DATABASENAME_AUTH}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_TYPE=${DB_TYPE}
      # jwt env
      - JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
      - JWT_ACCESS_EXPIRESIN=${JWT_ACCESS_EXPIRESIN}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - JWT_REFRESH_EXPIRESIN=${JWT_REFRESH_EXPIRESIN}
      # smtp env
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
    networks:
      - app
  main:
    container_name: gif_manager_main
    build:
      context: ./gif_manager_main
    depends_on:
      - db
    restart: always
    ports:
      - ${API_PORT_MAIN}:${API_PORT_MAIN}
    expose:
      - ${API_PORT_MAIN}
    environment:
      # base env
      - API_PORT_MAIN=${API_PORT_MAIN}
      - API_HOST_MAIN=${API_HOST_MAIN}
      - API_PORT_NODE_AUTH=${API_PORT_NODE_AUTH}
      - API_HOST_NODE_AUTH=${API_HOST_NODE_AUTH}
      - AUTH_HOST_MAIN=${AUTH_HOST_MAIN}
      - CLIENT_URL=${CLIENT_URL}
      # db env
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_DATABASENAME_MAIN=${DB_DATABASENAME_MAIN}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_TYPE=${DB_TYPE}
    volumes:
      - ./files:/usr/files
    networks:
      - app
  client:
    container_name: gif_manager_client
    build:
      context: ./gif_manager_client
    depends_on:
      - db
    restart: always
    ports:
      - ${API_PORT_CLIENT}:80
    networks:
      - app
    volumes:
      - ./files:/usr/share/nginx/html/files
networks:
  app:
    driver: bridge
```

3. Create `initdb.sh` file

```bash
#!/bin/bash

set -e
set -u

function create_user_and_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE USER $database;
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi
```

4. Clone repositories

```bash
git clone https://github.com/dmogilevtsev/node_auth
git clone https://github.com/dmogilevtsev/gif_manager_main
git clone https://github.com/dmogilevtsev/gif_manager_client
```

5. Run docker command

```bash
docker-compose up -d
```

APP will start on [http://localhost:3000/](http://localhost:3000/)

To register, click "Sign up" and write your current email address and come up with a password. An email with an activation link will be sent to your mail.
