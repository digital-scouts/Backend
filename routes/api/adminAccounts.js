const router = require('express').Router(),
    adminAccount = require('../../controller/adminAccountController'),
    token = require('../token').verifyToken;

router.route('/user')
    .get(token, adminAccount.getAllUsers)
    .delete(token, adminAccount.deleteAll);

router.route('/user/:id')
    .get(token, adminAccount.getOneUser)
    .delete(token, adminAccount.deleteUser);

router.route('/notActivated')
    .get(token, adminAccount.getNotActivatedUsers)
    .put(token, adminAccount.activateUser);

router.route('/disabled')
    .get(token, adminAccount.getDisabledUsers)
    .put(token, adminAccount.changeDisable);

router.route('/inactive')
    .get(token, adminAccount.getInactiveUsers);


module.exports = router;