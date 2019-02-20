const router = require('express').Router(),
    users = require('../../controller/userController'),
    token = require('../token').verifyToken,
    permission = require('../permission').hasPermission;

router.route('/')
    .get(users.getAll)
    .post(users.addUser)
    .delete(users.deleteAll);

router.route('/:id')
    .get(token, users.getUser)
    .delete(token, users.deleteUser);

router.route('/image')
    .post(token, permission("hi"), users.setProfilePicture);

module.exports = router;
