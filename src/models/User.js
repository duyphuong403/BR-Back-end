import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const UserModel = (() => {
	const salt = 14
	const Schema = mongoose.Schema

	/* Create a schema */
	const UserSchema = new Schema({
		FirstName: { type: String, maxLength: 100, required: true, trim: true, index: true },
		LastName: { type: String, maxLength: 100, required: true, trim: true, index: true },
		Email: { type: String, required: true, maxlength: 50, trim: true, unique: true },
		Password: { type: String, required: true },
		Dob: { type: String, required: true, maxLength: 20, trim: true },
		Gender: { type: String, required: true, maxLength: 10, trim: true },
		Address: { type: String, required: true, maxLength: 100, trim: true },
		AvatarURL: { type: String, maxLength: 100, trim: true, defaults: '' },
		IsActive: { type: Boolean, defaults: true },
		CreatedAt: { type: Date, default: Date.now },
	})

	/* Encrypt users' passwords using bcrypt */
	UserSchema.pre('save', function (next) {
		// Assign user model to variable user
		const user = this

		console.log(user)
		// Generate a salt and callback
		if (user.Password) {
			bcrypt.genSalt(salt, (error, salt) => {
				if (error) { return next(error) }

				// Hash (encrypt) our password using the salt
				bcrypt.hash(user.Password, salt, (_error, hash) => {
					if (_error) { return next(_error) }
					// Overwrite plain text password with encrypted password
					user.Password = hash
					next()
				})
			})
		} else {
			next()
		}
	})

	/* Save Data to User collection */
	UserSchema.methods.saveUser = (data) => {
		return new Promise((resolve, reject) => {
			UserModel.model('User').create(data, (error, newUser) => {
				return error ? reject(error) : resolve(newUser)
			})
		})
	}

	/* Update Avatar to User collection */
	UserSchema.methods.updateUser = (userId, updateUserInputs) => {
		return new Promise((resolve, reject) => {
			UserModel.model('User').findOneAndUpdate({ _id: userId }, updateUserInputs, { upsert: true, new: true }, (error, newUser) => {
				return error ? reject(error) : resolve(newUser);
			})
		})
	}

	/* Get all Users */
	UserSchema.methods.getUsers = () => {
		return new Promise((resolve, reject) => {
			/* Return all fields except Password */
			UserModel.model('User').find({}, '-Password', (error, users) => {
				return error ? reject(error) : resolve(users);
			})
		})
	}
	
	return mongoose.model('User', UserSchema)
})()

