const router = require('express').Router(),
    users = require('../../controller/userController'),
    token = require('../token').verifyToken,
    permission = require('../permission').checkPermission;

router.route('/')
    .get(token,permission, users.getAll)
    .post(users.addUser) //no token needed to create a account
    .put(token, users.updateUser);

router.route('/:id')
    .get(token, permission, users.getUser);

router.route('/image')
    .put(token, permission, users.setProfilePicture);

router.route('/password')
    .put(token, users.updatePassword);

router.route('/email')
    .put(token, users.updateEmail);

module.exports = router;
