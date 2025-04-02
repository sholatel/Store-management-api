# Mainstack Test Backend

## Description
This is the backend API for a basic store managment system, built using Node.js, Express, and TypeScript. The application includes authentication, validation, and database interactions with MongoDB.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/sholatel/Store-management-api
   cd Store-managment-api
   ```

2. Install dependencies:
   ```sh
   yarn
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   ALLOWED_ORIGINS=<List of comma separated allowed origins>
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_EXPIRES_IN=<JWT token expiry duration>
   JWT_SECRET=<your_jwt_secret>
   EMAIL_HOST=<your_email_host>
   EMAIL_PORT=<your_email_port>
   EMAIL_USER=<your_email_username>
   EMAIL_PASSWORD=<your_email_password>
   API_BASE_URL=<THe base url of the backend server + "/api/v1">
   ```

## Running the Application

### Development Mode
To run the application in development mode with hot reloading:
```sh
yarn run start:dev
```

### Production Mode
To build and run the application in production mode:
```sh
yarn run build
yarn run start:prod
```

## Testing
Run tests using:
```sh
yarn test
```

For test coverage:
```sh
yarn run test:coverage
```

To watch test files:
```sh
yarn run test:watch
```

## API Documentation
API routes and usage instructions can be found in the API documentation (if available). Use tools like Postman or Swagger to explore endpoints.

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **TypeScript**
- **Jest & Supertest (for testing)**
- **JWT Authentication**
- **Nodemailer (for emails)**

## Author
**Yusuf**

## License
This project is licensed under the MIT License.

