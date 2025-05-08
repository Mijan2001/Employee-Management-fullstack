import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import authRouter from './routes/auth.js';
import departmentRoute from './routes/department.js';
import employeeRoutes from './routes/employee.js';

import connectToDatabase from './db/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// MongoDB Connection
connectToDatabase();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRoute);
app.use('/api/employee', employeeRoutes);

// error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('index.js : Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
