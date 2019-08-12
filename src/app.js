require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston')
const { NODE_ENV } = require('./config')
const scoresRouter = require('./scores/scores-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: 'info.log' })
        ]
    });

    if(NODE_ENV !== 'production'){
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        if (req.method === "OPTIONS") {
          return res.send(204);
        }
        next();
      });

app.use(morgan(morganOption))
app.use(express.json()) 
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, world')
})
app.use('/api/scores', scoresRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'} }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app