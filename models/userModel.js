const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false 
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate : {
     
       validator : function (pc) {
          
          // abc === abc -> returns true
          // abc === xyz -> returns false
          return this.password === pc;
       },

       message : 'Password and ConfirmPassword are not the same'
    }

  },

  passwordChangedAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

});

// We want to encrypt the password only when we are creating the User or updating the password. So, when we are updating the email then their is no need to update the password in that case.

userSchema.pre('save' , async function (next) {
    
    // this points to the current document i.e. userSchema

    // If the password is not modified then just return and call the next middleware.
    if (!this.isModified('password')) return next();

    // We will hash the password using bcrypt
    // npm i bcryptjs

    // we also have to pass the cost parameter which means how cpu intensive this operation is. We are giving 12

    // We have two types of bcrypt 1. Synchronous and 2. Asynchronous

    // And we gonna use Asynchronous i.e. await this
    this.password = await bcrypt.hash(this.password , 12);
    
    // We only need it to check the password validation.
    // And we really not want to be persisted in the database.
    this.passwordConfirm = undefined;

    next();
});

// we will create a instance method that is gonna be available on all documents of a certain collection 
// candidatePassword : password enetered by the user 
// userPassword : password saved after the signing up of the user.

userSchema.methods.correctPassword = async function (candidatePassword , userPassword) {

  // this.password <---- not available as in password we had done : select:false

  // i.e. we passed the userPassword also.

  // Since , we cannot compare both the passwords as candidate password is the password coming from the user whereas userPassword is the hashed one.

  return await bcrypt.compare(candidatePassword , userPassword);

}


const User = mongoose.model('User', userSchema);    
module.exports = User;