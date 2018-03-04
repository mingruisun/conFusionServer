const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) =>
        {
            res.sendStatus(200);
        }
    )
    .get(cors.cors, (req, res, next) => {
        Leaders.find({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
        {
            Leaders.create(req.body)
                .then((resp) =>
                    {
                        console.log('leader created', resp);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }
                )
                .catch((err) => next(err));
        }
    )
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT Operation not supported on /leaders');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then((resp) =>
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }
            )
            .catch((err) => next(err));
    });

leaderRouter.route('/:leaderID')
    .options(cors.corsWithOptions, (req, res) =>
        {
            res.sendStatus(200);
        }
    )
    .get(cors.cors, (req, res, next) => {
        Leaders.findById(req.params.leaderID)
            .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }
            )
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST Operation not supported on /leaders/${req.params.leaderID}`);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderID, {$set: req.body}, {new: true})
            .then((resp) =>
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }
            )
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderID)
            .then((resp) =>
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }
            )
            .catch((err) => next(err));
    });


module.exports = leaderRouter;