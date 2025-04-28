const express = require('express'); // подключаем фреймворк Express (модуль)
const app = express(); // создаем экземпляр приложения
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const tokenKey = require("./config/tokenkey");
// const userController = require('./userController')
const postController = require('./app/postController')
const userController = require('./app/userController')

app.use(express.json());

//Проверка JWT токена, если проверка пройдена в request добавляем проверенного пользователя
app.use((req, res, next) => {
    if (req.headers.authorization) {
        let tokenParts = req.headers.authorization
            .split(' ')[1]
            .split('.');
        let signature = crypto
            .createHmac('SHA256', process.env.JWT_SECRET_TOKEN)
            .update(`${tokenParts[0]}.${tokenParts[1]}`)
            .digest('base64');

        if (signature === tokenParts[2] + '=') {
            req.user = JSON.parse(
                Buffer.from(
                    tokenParts[1],
                    'base64'
                ).toString('utf8')
            );
        }
    }

    next();
});

//Авторизация
app.post('/auth', userController.authUser);

// REST-API
// app.get('/users', userController.getUsers);
// app.get('/users/:id', userController.getUserById);
//
// app.post('/users', userController.createUser);
// app.put('/users/:id', userController.updateUser);
// app.delete('/users/:id', userController.deleteUser);


app.get('/posts', postController.getPosts);
app.get('/posts/:id', postController.getPostById);
app.post('/posts', postController.createPost);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

app.use(cors())


// начинаем прослушивать порт 8080, тем самым запуская http-сервер
app.listen(8082, function () {
    console.log('Listening on port 8080')
})