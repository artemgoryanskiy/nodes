import express from 'express';
import mongoose from 'mongoose';
import {loginValidation, postCreateValidation, registerValidation} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import {getMe, login, register} from './controllers/UserController.js';
import {create} from './controllers/PostController.js';

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

app.post('/auth/register', registerValidation, register)
app.post('/auth/login', loginValidation, login)
app.get('/auth/me', checkAuth, getMe)

// app.get('/posts', PostController.getAll)
// app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, create)
// app.delete('/posts', PostController.remove)
// app.path('/posts', PostController.update)





app.listen(4444, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server is running on port 4444');
        }
    }
)