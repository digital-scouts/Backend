var router = require('express').Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    const payload = {
        email: 'mail',
        role: 'user',
        userID: '1234',
        userNameFirst: 'bob'
    };

    res.status(200).json(
        {
            status: 200,
            message: "Request successful.",
            token: jwt.sign(payload, app.get('salt'))
        }
    );
});

module.exports = router;
