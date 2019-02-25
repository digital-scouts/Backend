"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adminAccountController_1 = require("../../controller/adminAccountController");
var token_1 = require("../token");
var permission_1 = require("../permission");
var AdminAccounts = /** @class */ (function () {
    function AdminAccounts() {
        this.router = express_1.Router();
        this.init();
    }
    AdminAccounts.prototype.init = function () {
        this.router.route('/user')
            .get(token_1.verifyToken, permission_1.checkPermission, adminAccountController_1.AdminAccount.getAllUsers)
            .delete(token_1.verifyToken, adminAccountController_1.AdminAccount.deleteAll);
        this.router.route('/user/:id')
            .get(token_1.verifyToken, adminAccountController_1.AdminAccount.getOneUser)
            .delete(token_1.verifyToken, adminAccountController_1.AdminAccount.deleteUser);
        this.router.route('/notActivated')
            .get(token_1.verifyToken, adminAccountController_1.AdminAccount.getNotActivatedUsers)
            .put(token_1.verifyToken, adminAccountController_1.AdminAccount.activateUser);
        this.router.route('/disabled')
            .get(token_1.verifyToken, adminAccountController_1.AdminAccount.getDisabledUsers)
            .put(token_1.verifyToken, adminAccountController_1.AdminAccount.changeDisable);
        this.router.route('/inactive')
            .get(token_1.verifyToken, adminAccountController_1.AdminAccount.getInactiveUsers);
    };
    return AdminAccounts;
}());
var adminAccountsRouter = new AdminAccounts();
adminAccountsRouter.init();
exports.default = adminAccountsRouter.router;
