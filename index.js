import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import {registerValidation} from './validations/auth.js';
import User from './models/User.js';

mongoose.connect('mongodb+srv://argo:a955927b@cluster0.4w3ke.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.log(err);
	}
	)

const app = express();
app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new User({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})
		const user = await doc.save();
		const token = jwt.sign({
			_id: user._id
		}, 'secret', {
			expiresIn: '30d'
		});
		const {passwordHash, ...userData} = user._doc
		res.json({...userData, token})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		});
	}

})

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Server is running on port 4444');
	}
	}
)