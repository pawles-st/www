const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.set('view engine', 'ejs'); //ustawiamy ejs jako silnik szablonów
app.set('views', './views'); //ustawiamy katalog 'views' jako katalog z szablonami widoków 
app.use(express.static('public')); //udostępniamy statycznie dokument css

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/todos',
  method: ''
};


app.get('/', (req, res) => {

  options.method ='GET';

  const request = http.request(options, response => {
    let responseData = '';

    response.on('data', chunk => {
      responseData += chunk;
    });

    response.on('end', () => {
      const data = JSON.parse(responseData);
      res.render('list', {data});
      console.log(data);
    });
  });

  request.on('error', error => {
    console.error('Błąd pobierania danych z REST API:', error);
    res.status(500).json({ message: 'Wystąpił błąd w serwerze.' });
  });

  request.end();
});

// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
