"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var errors_2 = require("../errors");
var userModel_1 = require("../models/userModel");
var AdminAccount = /** @class */ (function () {
    function AdminAccount() {
    }
    /**
     * get all data from all users
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getAllUsers = function (request, response, next) {
        userModel_1.User.find()
            .populate('group')
            .sort({ 'name_last': 1 })
            .then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * get all data from one user
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getOneUser = function (request, response, next) {
        // let requestedUserID = request.params.id;
        userModel_1.User.findById(request.params.id).then(function (user) {
            if (user) {
                response.status(200).json(user);
            }
            else {
                return next(new errors_2.ErrorREST(errors_1.Errors.NotFound, "User does not exist."));
            }
        }).catch(next);
    };
    /**
     * delete user by id in params
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.deleteUser = function (request, response, next) {
        if (request.query.id) {
            userModel_1.User.remove({ _id: request.query.id }).then(function (user) { return response.json({ removedElements: user }); }).catch(next);
        }
        else {
            userModel_1.User.deleteMany().then(function (data) { return response.json(data); }).catch(next);
        }
    };
    /**
     * get a list of users with not activated accounts
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getNotActivatedUsers = function (request, response, next) {
        userModel_1.User.find({ 'accountStatus.activated': false }).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * activate a specific users account and set namiLink when possible
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.activateUser = function (request, response, next) {
        var updateQuery = {
            'accountStatus.activated': true
        };
        if (request.query.namiLink) {
            updateQuery['accountStatus.namiLink'] = request.query.namiLink;
        }
        userModel_1.User.findByIdAndUpdate(request.query.id, { $set: updateQuery }, { new: true }, function (err, doc) {
            if (err)
                response.status(errors_1.Errors.BadRequest.status, "No user with this id found").json(err);
            response.json(doc);
        });
    };
    /**
     * get a list of disabled accounts
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getDisabledUsers = function (request, response, next) {
        userModel_1.User.find({ 'accountStatus.disabled': true }).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * disable or enable a specific user account
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.changeDisable = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var isDisabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isDisabled = false;
                        return [4 /*yield*/, userModel_1.User.findById(request.query.id, function (err, doc) {
                                isDisabled = doc.accountStatus.disabled;
                            })];
                    case 1:
                        _a.sent();
                        userModel_1.User.findByIdAndUpdate(request.query.id, { $set: { 'accountStatus.disabled': !isDisabled } }, { new: true }, function (err, doc) {
                            if (err)
                                response.status(errors_1.Errors.BadRequest.status, "No user with this id found").json(err);
                            response.json(doc);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get a list of inactive accounts
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getInactiveUsers = function (request, response, next) {
        userModel_1.User.find({ 'accountStatus.inactive': true }).then(function (data) { return response.json(data); }).catch(next);
    };
    return AdminAccount;
}());
exports.AdminAccount = AdminAccount;
//# sourceMappingURL=adminAccountController.js.map