const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    admin_id:{
        type:Number,
        required:[true, 'admin must have a number'],
        unique:true,
    },
    name:{
        type:String,
    },

    email:{
        type:String,
        required:[true, 'please provide a valid email address'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email'],
    },

    role:{
        type:String,
        
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
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        },
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
      
})

adminSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

  adminSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  
  adminSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };
  
  adminSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  