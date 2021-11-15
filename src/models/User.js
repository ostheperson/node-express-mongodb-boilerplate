const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		first: {
			type: String,
			required: [true, 'lastname can\'t be empty']
		},
		middle: {
			type: String,
		},
		last: {
			type: String,
			required: [true, 'lastname can\'t be empty']
		}
	},
	username: {
		type: String,
		required: [true, 'username can\'t be empty'],
		unique: true,
		trim: true,
		index: true
	},
	email: {
		type: String,
		required: [true, 'email can\'t be empty'],
		unique: true,
		trim: true,
		index: true
	},
	password: {
		type: String,
		required: [true, 'password can\'t be empty'],
		required: true
	},
	interests: [
		{
			type: Schema.Types.ObjectId,
			ref: "Tag"
		}
	],
	joinedPosts: [
		{
			type: Schema.Types.ObjectId,
			ref: "Post"
		}
	],
	createdPosts: [
		{
			type: Schema.Types.ObjectId,
			ref: "Post"
		}
	],
	details: {
		dob: {
        	type: String,
		},
		country: {
			type: String
		}
	},
	followers: [{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			unique: true,
		},
		createdAt: String
	}],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt);
	next()
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
};

const User = mongoose.model('User', UserSchema);

UserSchema.path('email').validate(async (email) => {
	emailCount = await User.countDocuments({ email })
	return !emailCount
}, "Email already exists")

UserSchema.path('username').validate(async (username) => {
	usernameCount = await User.countDocuments({ username })
	return !usernameCount
}, "Username already exists")

// PostSchema.methods.follow = async function (userId) {
// 	this.members.push(userId)
// 	// let  post = await Post.find(postId)
//     // if (post.members.indexOf(userId) === -1) {
//     //     this.members.push(userId)        
//     // } else { this.members.push(userId) }
// 	// console.log(post.members)
//     return this.save()
// }

module.exports = {User}
