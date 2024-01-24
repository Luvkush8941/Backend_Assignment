const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require(path.join(__dirname , '/routes/userRoutes'));
const orderTrackingRouter = require(path.join(__dirname , '/routes/orderRoutes'));

// Importing AppError class
const AppError = require (path.join(__dirname ,'/utils/appError.js'));
const globalErrorHandler = require(path.join(__dirname ,'/Controllers/errorController.js'))


const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());

app.use(cookieParser());

// Mounting the routers
app.use('/auth', userRouter);
app.use('/', orderTrackingRouter);

// All the URL that gonna not handled before , will be handled here.
app.all('*' , (req , res , next) => {
    
    next(new AppError (`Can't find ${req.originalUrl} on this server` , 404));
})


// ----> Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;