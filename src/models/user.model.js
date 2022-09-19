const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const { toJSON } = require('./plugins');
const { roles } = require('../config/roles');

const accountStatus = {
	PENDING: 'Pending',
	ACTIVE: 'Active',
	SUSPENDED: 'Suspended',
	BLOCKED: 'Blocked'
};

const userSchema = new Schema({
    display_name: {type: String, trim: true, maxlength: 24},
    username: {type: String,required: true, unique: true, index:true, trim:true},
    avatar: {type: String},
    email: {type: String, trim: true, lowercase: true, immutable: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type: String, trim: true, private: true},
    dob:{type:Date},
    bio: {type: String, maxlength: 50},
    country:String,
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followersCount: {type: Number, default: 0},
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followingCount: {type: Number, default: 0},
    joined: Date,
    last_login_time: {type:Date},
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    }],
    bookmarks: {
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: false
        }],
    }
    preferences: [{type: String}]
}, {timestamps: true, toJSON: { getters: true } });

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isUsernameTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
};

userSchema.methods.comparePin = async function (candidatePin) {
    const isMatch = await bcrypt.compare(candidatePin, this.pin)
    return isMatch
};

userSchema.pre('save', { document: true, query: false }, async function (next) {
  const user = this;
  const saltRounds = 10;
  if (user.isModified('password')) {
    this.password = await bcrypt.hash(user.password, saltRounds);
  }
  if (user.isModified('pin')) {
    this.pin = await bcrypt.hash(user.pin, saltRounds);
  }
  if (user.isModified('following')) {
    this.followingCount = this.following.length;
  }
  if (user.isModified('followers')) {
    this.followersCount = this.followers.length;
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema); 
module.exports = {User, accountStatus}


