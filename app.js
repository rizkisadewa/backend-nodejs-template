import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import passportConfig from './config/passport';
import routes from './routes';
import database from './models';

const hostname = '127.0.0.1';
const port = 3002;
const app = express(); // setup express application
const server = http.createServer(app);
const expressip = require('express-ip');

app.use(expressip().getIpInfoMiddleware); // Log client ip

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

app.use(cors());

routes(app);

app.get('*', (req, res) => res.send({
    message: 'Rest API Template',
}));

server.listen(port, hostname, () => {
    console.log(`Rest API Server running at http://${hostname}:${port}/`);
});

database.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
