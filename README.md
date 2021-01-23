# Relay

## To run:

#### Install dependencies for React:

```
git clone
cd Relay
npm install
```

#### Install dependencies for REST API:
```
cd server
npm install
```

While inside server folder, make a ".env" file and add environment variables to it that matches your database setup:

```
DB_DATABASE_NAME="database name"
DB_HOST="hostname"
DB_USER="username"
DB_PASSWORD="password
DB_PORTNR=8889
DB_SOCKETPATH=/Applications/MAMP/tmp/mysql/mysql.sock //optional i think?
```

#### Database setup:
Uses a MySQL database, see inside folder SQL for creating database tables.

