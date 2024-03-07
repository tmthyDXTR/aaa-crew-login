import { createDBConnection } from "./db";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create sql db connection
const connection = createDBConnection();

