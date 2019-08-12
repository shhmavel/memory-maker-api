const express = require('express')
const path = require('path')
const ScoresService = require('./scores-service.js')
const jsonBodyParser = express.json()
const scoresRouter = express.Router()

scoresRouter
    .route('/')
    .get((req, res, next) => {
        ScoresService.getAllScores(req.app.get('db'))
            .then(races => {
                res.json(races.map(ScoresService.serializeScore))
            })
            .catch(next)
    })

scoresRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const { initials, score } = req.body
        const newScore = { initials, score }


        for(const field of ['initials', 'score'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        return ScoresService.insertScore(
            req.app.get('db'),
            newScore
        )
        .then(score => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${score.id}`))
            .json(ScoresService.serializeScore(score))
        })
        .catch(next)  
    })

    module.exports = scoresRouter