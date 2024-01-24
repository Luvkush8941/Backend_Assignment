const path = require("path");
const User = require(path.join(__dirname, "/../models/userModel"));
const jwt = require("jsonwebtoken");
const {promisify} = require('util');

const AppError = require(path.join(__dirname, "./../utils/appError"));
const catchAsync = require('./../utils/catchAsync');

// Creating a token and giving id as a payload
const signToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

};

const createSendToken = (user, statusCode, res) => {

  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Creating a new User
exports.signUp = catchAsync(async (req, res, next) => {


    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      
    });

    createSendToken(newUser, 201, res);

  
});

exports.login = catchAsync (async (req, res, next) => {

    // Using ES6 destructuring
    const { email, password } = req.body;

    // Check if email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password! 💥", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect Email or Password", 401));
    }

    // 3) If everything ok, send token to client
  createSendToken(user, 200, res);


});

exports.logout = (req , res) => {
   
  res.cookie('jwt' , 'loggedout' , {
    
   // After 5s we will we log out.
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true

  });

  res.status(200).json({status: 'success'});


}



exports.protect = catchAsync(async (req , res , next) => {

  let token;

  if (req.headers.cookie === undefined) return next(new AppError ('You are not loggen in! Please login to get access' , 401));

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    token = req.headers.authorization.split(' ')[1];
   
  } else if (req.headers.cookie.split('=')[0] === 'jwt') {
       
       token = req.headers.cookie.split('=')[1];
  }

  
  // their is no token
  if (!token) {

    return next(new AppError ('You are not loggen in! Please login to get access' , 401));
    
  }


  const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

  const currentUser = await User.findById (decoded.id);

  if (!currentUser) {

    return next(new AppError ('The user belonging to this token does not longer exists.' , 401));
  }

  
  req.user = currentUser;
  res.locals.user = currentUser; 
  next();

});



exports.checkSession = catchAsync(async (req, res, next) => {
  
    // Extract user information from the request (you might have a middleware for this)
    const userId = req.user.id; // Adjust this based on how you store user information in the request

    // Fetch user data from the database
    const user = await User.findById(userId);

    // Respond with user data, excluding sensitive information like password
    user.password = undefined;
   
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  
});