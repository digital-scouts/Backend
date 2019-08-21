"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = require("../../controller/userController");
var token_1 = require("../token");
var permission_1 = require("../permission");
var Users = /** @class */ (function () {
    function Users() {
        this.router = express_1.Router();
        this.init();
    }
    Users.prototype.init = function () {
        this.router.route('/')
            .get(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.getAll)
            .post(userController_1.UserController.addUser) //no token needed to create a account
            .put(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.updateUser);
        this.router.route('/:id')
            .get(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.getUser);
        this.router.route('/image')
            .put(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.setProfilePicture);
        this.router.route('/password')
            .put(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.updatePassword);
        this.router.route('/email')
            .put(token_1.verifyToken, permission_1.checkPermission, userController_1.UserController.updateEmail);
    };
    return Users;
}());
var usersRouter = new Users();
usersRouter.init();
exports.default = usersRouter.router;
//# sourceMappingURL=users.js.map