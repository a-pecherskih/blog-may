const express = require('express'); // подключаем фреймворк Express (модуль)
const app = express(); // создаем экземпляр приложения
const cors = require('cors');

app.use(cors())
// начинаем прослушивать порт 8080, тем самым запуская http-сервер
app.listen(8080, function () {
    console.log('Listening on port 8080')
})

const router = express.Router(); // создаем экземпляр роутера
const path = __dirname; // записываем путь до рабочего каталога

// выводим в консоль лог при запроса
router.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " " + req.query + " " + req.body);
    next();
});

router.get('/', function (req, res) {
    res.send('Hello from server');
    // res.sendFile(path + '/index.html');
});

app.use('/', router);

