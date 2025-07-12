const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const config = require('config');
const AppError = require('../utils/AppError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field'],
      minLength: [3, 'Username must be atleast 3 chars long'],
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      // This validation runs only on SAVE / CREATE
      // but not on UPDATE
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: 'Email should be in a valid format',
      },
      unique: true,
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      minLength: [8, 'Password must be atleast 8 chars long'],
      // we need to mark it as false, so /^find/ would never give us password by default
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    // only run this if password is actually modified
    if (!this.isModified('password')) return next();
    const saltRounds = config.get('costFactor');
    const saltedAndHashedPassword = await bcrypt.hash(
      this.password,
      saltRounds
    );
    this.password = saltedAndHashedPassword;
    next();
  } catch (error) {
    next(new AppError('User Signup Failed', 400));
  }
});

// Instance Method
userSchema.methods.validatePassword = async function (candiadtePassword) {
  return bcrypt.compare(candiadtePassword, this.password);
};

userSchema.methods;

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
