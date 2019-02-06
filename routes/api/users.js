const router = require('express').Router(),
    users = require('../../controller/userController'),
    token = require('../token').verifyToken;

router.route('/')
    .get(token, users.getAll)
    .post(users.addOne)
    .delete(token, users.deleteAll);

router.route('/:id')
    .get(token, users.getOne)
    .delete(token, users.deleteOne);

router.route('/image')
    .post(token, users.setProfilePicture);

router.route('/demo')
    .post(users.addDemo);

module.exports = router;