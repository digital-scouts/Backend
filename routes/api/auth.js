const router = require('express').Router(),
    auth = require('../../controller/authController');

router.route('/')
    .post(auth.authenticate); // no token needed to login


module.exports = router;