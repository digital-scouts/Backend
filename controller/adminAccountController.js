"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expressApp_1 = require("../expressApp");
var errors_1 = require("../errors");
var errors_2 = require("../errors");
var userModel_1 = require("../models/userModel");
var AdminAccount = /** @class */ (function () {
    function AdminAccount() {
    }
    /**
     * todo
     * get all data from all users
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getAllUsers = function (request, response, next) {
        if (expressApp_1.default.get('DEBUG') || request.decoded.role === 'admin') {
            userModel_1.user.find().then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            return next(new errors_2.ErrorREST(errors_1.Errors.Forbidden));
        }
    };
    /**
     * todo
     * get all data from one user
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getOneUser = function (request, response, next) {
        var requestedUserID = request.params.id;
        var ownUserID = request.decoded.userID;
        userModel_1.user.findById(requestedUserID).then(function (user) {
            if (user) {
                response.status(200).json(user);
            }
            else {
                return next(new errors_2.ErrorREST(errors_1.Errors.NotFound, "User does not exist."));
            }
        }).catch(next);
    };
    /**
     * For debug and testing, remove all users at once
     * permission: admin
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    AdminAccount.deleteAll = function (request, response, next) {
        if (expressApp_1.default.get('DEBUG') || request.decoded.role === 'admin') {
            userModel_1.user.deleteMany().then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            return next(new errors_2.ErrorREST(errors_1.Errors.Forbidden));
        }
    };
    /**
     * delete user by id in params
     * permission: admin
     * todo permission check
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.deleteUser = function (request, response, next) {
        var requestedUserID = request.params.id;
        var ownUserID = request.decoded.userID;
        userModel_1.user.remove({ _id: requestedUserID }).then(function (user) { return response.json({ removedElements: user }); }).catch(next);
    };
    /**
     * todo
     * get a list of users with not activated accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getNotActivatedUsers = function (request, response, next) {
        //modelUser.find().then(data => response.json(data)).catch(next);
        response.status(errors_1.Errors.NoContent.status).json();
    };
    /**
     * todo
     * activate a specific users account
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.activateUser = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json();
    };
    /**
     * todo
     * get a list of disabled accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getDisabledUsers = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json();
    };
    /**
     * todo
     * disable or enable a specific user account
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.changeDisable = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json();
    };
    /**
     * todo
     * get a list of inactive accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getInactiveUsers = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json();
    };
    return AdminAccount;
}());
exports.AdminAccount = AdminAccount;
