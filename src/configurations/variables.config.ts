import dotenv from "dotenv";
dotenv.config()


const variables = {
    TEST_SERVER_URL: process.env.TEST_SERVER_URL || 'http://localhost:3000'
}

export default variables