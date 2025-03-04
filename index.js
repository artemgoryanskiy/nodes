import express from 'express';
import mongoose from 'mongoose';
import {loginValidation, postCreateValidation, registerValidation} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import {getMe, login, register} from './controllers/UserController.js';
import {create, getAll, getOne, remove, update} from './controllers/PostController.js';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect('mongodb+srv://argo:a955927b@cluster0.4w3ke.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
            console.log(err);
        }
    )

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

const upload = multer({storage: storage})

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`
    })
})

app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)

app.listen(4444, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server is running on port 4444');
        }
    }
)