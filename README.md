# Post-It
It is the backend code for Post-It Api.

### Features
- User Module
  - Register
  - Login
  - Follow User
  - Unfollow User
  - Create Post
  - Like Post
  - Dislike Post
  - Put Comment
  - Like Comment
  - Dislike Comment
  - Reply Comment
  - More...

- Admin Module
  - CRUD Operations
---
## Tools
- Javascript
- Nodejs
- Express
- MongoDB
## Installtion
In the root directory run command
```
npm install
```
or
```
yarn
```
Add .env file in root directory, and should look like this
```
# Node env
NODE_ENV=development

# Port number
PORT=5000

# File Paths
ROOT_PATH=http://localhost:5000/uploads/
WRITE_PATH=public/uploads

# Mongo Url
MONGODB_URL="user-mongodb-url"

# JWT
# JWT secret key -- TYtaGSPFKiutyVtPIhzR
JWT_SECRET=TYtaGSPFKiutyVtPIhzR
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_DAYS=90
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=182
```
## Run Project
In root directory run the command.
```
yarn dev
```
or
```
npm run dev
```
