var router = require('express').Router(),
    jwt = require('jsonwebtoken'),
    token = require('./token').verifyToken;

router.route('/')
    .get(function(req, res, next) {
        res.status(200).json(
            {
                status: 200,
                message: "Request successful.",
            }
        );
    })
    .post(token, function (req, res, next) {
        res.status(200).json(
            {
                status: 200,
                message: "Request successful.",
            }
        );
    });

module.exports = router;
