const router = require('express').Router(),
    users = require('../../controller/userController'),
    token = require('../token').verifyToken;

router.route('/')
    .get(users.getAll)
    .post(users.addUser)
    .delete(users.deleteAll);

module.exports = router;