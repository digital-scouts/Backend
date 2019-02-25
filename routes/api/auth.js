"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authController_1 = require("../../controller/authController");
var express_1 = require("express");
var Auth = /** @class */ (function () {
    function Auth() {
        this.router = express_1.Router();
        this.init();
    }
    Auth.prototype.init = function () {
        this.router.route('/')
            .post(authController_1.AuthController.authenticate); // no token needed to login
    };
    return Auth;
}());
var authRouter = new Auth();
authRouter.init();
exports.default = authRouter.router;
