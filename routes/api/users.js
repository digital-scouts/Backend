const router = require('express').Router(),
    users = require('../../controller/userController'),
    token = require('../token').verifyToken;

router.route('/')
    .get(token, users.getAll)
    .post(users.addUser) //no token needed to create a account
    .put(token, users.updateUser);

router.route('/:id')
    .get(token, users.getUser);

router.route('/image')
    .post(token, users.setProfilePicture);

router.route('/password')
    .put(token, users.updatePassword);

router.route('/email')
    .put(token, users.updateEmail);

module.exports = router;
