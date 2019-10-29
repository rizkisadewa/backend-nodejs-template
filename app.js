import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportConfig from './config/passport';
import routes from './routes';

const hostname = '127.0.0.1';
const port = 3001;
const app = express(); // setup express application
const server = http.createServer(app);

app.use(logger('dev')); // log requests to the console

app.use(passport.initialize());
//initializes the passport configuration.

passportConfig(passport);
//imports our configuration file which holds our verification callbacks and things like the secret for signing.

// Parse incoming requests data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

routes(app);

app.get('*', (req, res) => res.send({
    message: 'Rest API Kartu Maslahah',
}));

server.listen(port, hostname, () => {
    console.log(`Rest API Server running at http://${hostname}:${port}/`);
});