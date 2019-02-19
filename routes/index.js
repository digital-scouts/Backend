const router = require('express').Router(),
    jwt = require('jsonwebtoken'),
    token = require('./token').verifyToken;

router.route('/')
    .get(function(req, res, next) {//test the RESTful API
        res.status(200).json(
            {
                status: 200,
                message: "RESTful API works.",
            }
        );
    })
    .post(token, function (req, res, next) {//test if the token is valid
        res.status(200).json(
            {
                status: 200,
                message: "Token is correct.",
            }
        );
    });

module.exports = router;
