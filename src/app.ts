import express, { Application, Request, Response, NextFunction } from 'express';
import cors from "cors";
import { corsOptions } from './configurations/cors.config';
import jsonResponse from './utils/jsonResponse';
import dotenv from "dotenv"
import logger from './utils/logger';
import userRoutes from './modules/user/routes/user.routes'
import connectDB from './configurations/db.config';
import storeRoutes from "./modules/store/routes/store.route";
import productRoutes from "./modules/product/routes/product.route";

dotenv.config()

const app: Application = express();
//const port = process.env.PORT || 5000
const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT || 5000;

app.listen(port, ()=> {
    logger(`Server started listening on port ${port} successfully!`)
})

//connect to DB
connectDB()

// Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1",userRoutes)
app.use("/api/v1",storeRoutes)
app.use("/api/v1", productRoutes)

//Health check
app.get("/api/v1", async(req:Request, res:Response)=> {
    res.status(200).send("Server is live and up!!!")
})

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;

