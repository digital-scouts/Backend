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
var userModel_1 = require("../models/userModel");
var groupModel_1 = require("../models/groupModel");
var errors_1 = require("../errors");
var namiController_1 = require("./namiController");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    /**
     * For debug and testing, show all users at once
     * todo move to AdminAccount
     * todo return only names and group
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    UserController.getAll = function (request, response, next) {
        if (request.decoded) {
            userModel_1.User.find({ 'role': request.decoded.role }).then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            userModel_1.User.find().then(function (data) { return response.json(data); }).catch(next);
        }
    };
    /**
     * add a new user to database
     * @param request
     * @param result
     * @param next
     * @returns {Promise<void>}
     */
    UserController.addUser = function (request, result, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userModel_1.User.findOne({ email: request.body.email }).lean().exec()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, next(new errors_1.ErrorREST(errors_1.Errors.Forbidden, 'A user with the provided email already exists'))];
                        }
                        user = new userModel_1.User(request.body);
                        user.validate(function (err) {
                            if (err) {
                                for (var errName in err.errors) {
                                    if (err.errors[errName].name === 'ValidatorError') {
                                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
                                    }
                                }
                            }
                        });
                        return [4 /*yield*/, user.save().then(function (user) { return result.status(200).json(user); }).catch(next)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * todo set the profile picture
     * todo check if user has permission
     * @param request
     * @param response
     * @param next
     */
    UserController.setProfilePicture = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json();
    };
    /**
     * get user by id in params
     * @param request
     * @param response
     * @param next
     */
    UserController.getUser = function (request, response, next) {
        var requestedUserID = request.params.id;
        var ownUserID = request.decoded.userID;
        userModel_1.User.findById(requestedUserID, {
            name_first: 1,
            name_last: 1,
            image_profile: 1,
            role: 1
        }).then(function (user) {
            if (user) {
                response.status(200).json(user);
            }
            else {
                return next(new errors_1.ErrorREST(errors_1.Errors.NotFound, 'User does not exist.'));
            }
        }).catch(next);
    };
    /**
     * todo send verification email to given email
     * todo confirm and update email in another method
     * @param request
     * @param response
     * @param next
     */
    UserController.updateEmail = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json({});
    };
    /**
     * todo confirm old password, than update new password
     * @param request
     * @param response
     * @param next
     */
    UserController.updatePassword = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json({});
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    UserController.updateNamiLink = function (request, response, next) {
        userModel_1.User.findByIdAndUpdate(request.query.id, { $set: { 'accountStatus.namiLink': request.body.nami } }, { new: true }, function (err, doc) {
            if (err) {
                response.status(errors_1.Errors.BadRequest.status, 'No user with this id found').json(err);
            }
            response.json(doc);
        });
    };
    /**
     * update everything in the user model except email and password
     * todo check witch data is given
     * todo update new data
     * @param request
     * @param response
     * @param next
     */
    UserController.updateUser = function (request, response, next) {
        response.status(errors_1.Errors.NoContent.status).json({});
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    UserController.getAllUserByGroupWithNamiInfo = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var namiFilter, dbUser, groupId, group, namiUserList, promiseExecution, i, namiUser, allUsers, _loop_1, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        namiFilter = '';
                        if (!request.query.group) return [3 /*break*/, 3];
                        groupId = request.query.group;
                        return [4 /*yield*/, groupModel_1.Group.findById(groupId)];
                    case 1:
                        group = _a.sent();
                        namiFilter = group.name.toLowerCase();
                        return [4 /*yield*/, userModel_1.User.find({ 'group': groupId }).populate('group')];
                    case 2:
                        dbUser = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, userModel_1.User.find().populate('group')];
                    case 4:
                        dbUser = _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, namiController_1.NamiAPI.getAllMembers(namiFilter)];
                    case 6:
                        namiUserList = _a.sent();
                        promiseExecution = [];
                        for (i = 0; i < namiUserList['length']; i++) {
                            promiseExecution.push(namiController_1.NamiAPI.getOneMember(namiUserList[i]['id']));
                        }
                        return [4 /*yield*/, Promise.all(promiseExecution)];
                    case 7:
                        namiUser = _a.sent();
                        allUsers = [];
                        _loop_1 = function (i) {
                            var user = dbUser.find(function (user) {
                                return '' + user['accountStatus']['namiLink'] === '' + namiUser[i]['mitgliedsNummer'];
                            });
                            if (user) {
                                var index = dbUser.indexOf(user);
                                if (index > -1) {
                                    dbUser.splice(index, 1);
                                }
                            }
                            allUsers.push({
                                dbData: user ? {
                                    image_profile: user['image_profile'],
                                    id: user['_id'],
                                    name_first: user['name_first'],
                                    name_last: user['name_last'],
                                    email: user['email'],
                                    role: user['role'],
                                    group: user['group'],
                                    accountStatus: user['accountStatus']
                                } : null,
                                namiData: {
                                    mitgliedsNummer: namiUser[i]['mitgliedsNummer'],
                                    vorname: namiUser[i]['vorname'],
                                    nachname: namiUser[i]['nachname'],
                                    eintrittsdatum: namiUser[i]['eintrittsdatum'],
                                    status: namiUser[i]['status'],
                                    telefon1: namiUser[i]['telefon1'],
                                    telefon2: namiUser[i]['telefon2'],
                                    telefon3: namiUser[i]['telefon3'],
                                    telefax: namiUser[i]['telefax'],
                                    emailVertretungsberechtigter: namiUser[i]['emailVertretungsberechtigter'],
                                    email: namiUser[i]['email'],
                                    strasse: namiUser[i]['strasse'],
                                    plz: namiUser[i]['plz'],
                                    ort: namiUser[i]['ort'],
                                    geburtsDatum: namiUser[i]['geburtsDatum'],
                                    stufe: namiUser[i]['stufe'],
                                }
                            });
                        };
                        //push all nami user to array with db data if exist
                        for (i = 0; i < namiUser['length']; i++) {
                            _loop_1(i);
                        }
                        //push remaining db users
                        for (i = 0; i < dbUser['length']; i++) {
                            allUsers.push({
                                dbData: {
                                    image_profile: dbUser[i]['image_profile'],
                                    id: dbUser[i]['_id'],
                                    name_first: dbUser[i]['name_first'],
                                    name_last: dbUser[i]['name_last'],
                                    email: dbUser[i]['email'],
                                    role: dbUser[i]['role'],
                                    group: dbUser[i]['group'],
                                    accountStatus: dbUser[i]['accountStatus']
                                },
                                namiData: null
                            });
                        }
                        response.json(allUsers);
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map