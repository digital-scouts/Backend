const router = require('express').Router(),
    auth = require('../../controller/authController');

router.route('/')
    .post(auth.authenticate);


module.exports = router;