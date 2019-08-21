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
var config_1 = require("./../config");
var mailController_1 = require("./mailController");
var _helper_1 = require("./_helper");
var apiClient = require('request');
var Status;
(function (Status) {
    //connection hasn't started
    Status[Status["IDLE"] = 1] = "IDLE";
    //authentication has started
    Status[Status["AUTH"] = 2] = "AUTH";
    // client is connected
    Status[Status["CONNECTED"] = 3] = "CONNECTED";
    // an error occurred
    Status[Status["ERROR"] = 99] = "ERROR";
})(Status = exports.Status || (exports.Status = {}));
/**
 * Promise based Class for communication with DPSG Namentliche Mitgliedermeldung
 */
var NamiAPI = /** @class */ (function () {
    //contains the untergliederungId for the search request
    function NamiAPI(loginName, password, groupId) {
        apiClient.defaults({ jar: true });
        this.loginName = loginName;
        this.password = password;
        this.host = "https://nami.dpsg.de";
        this.authURL = "/ica/rest/nami/auth/manual/sessionStartup";
        this.cookieJar = apiClient.jar();
        this.status = Status.IDLE;
        this.apiMajor = null;
        this.apiMinor = null;
        this.groupId = groupId;
    }
    /**
     * Logs in the User.
     * Returns Promise which is resolved once the user is logged in
     */
    NamiAPI.prototype.startSession = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //do not start a new session if one is already in progress
            if (_this.status === Status.CONNECTED) {
                resolve(true);
                return;
            }
            if (_this.status === Status.AUTH) {
                console.warn("Auth Cancelled: Current Nami Status is AUTH");
                resolve(false);
                return;
            }
            _this.status = Status.AUTH;
            apiClient.post({
                url: _this.host + _this.authURL,
                jar: _this.cookieJar,
                form: {
                    username: _this.loginName,
                    password: _this.password,
                    Login: "API",
                    redirectTo: "./pages/loggedin.jsp"
                }
            }, function (error, response, body) {
                if (error) {
                    _this.status = Status.ERROR;
                    reject(error);
                    return;
                }
                if (response.statusCode === 302) {
                    apiClient.get({
                        url: response.headers.location,
                        jar: _this.cookieJar
                    }, function (error2, response2, body2) {
                        if (error2) {
                            _this.status = Status.ERROR;
                            reject(error);
                            return;
                        }
                        if (response2.statusCode !== 200) {
                            _this.status = Status.ERROR;
                            reject("AUTH Error: status code != 200 (in second response). Response:\n" + JSON.stringify(response2.toJSON()));
                            return;
                        }
                        console.log("Successfully connected to Nami");
                        _this.status = Status.CONNECTED;
                        body2 = JSON.parse(body2);
                        _this.apiMajor = body2.majorNumber;
                        _this.apiMinor = body2.minorNumber;
                        resolve(true);
                    });
                }
                else {
                    _this.status = Status.ERROR;
                    try {
                        body = JSON.parse(body);
                    }
                    catch (err) {
                        reject("AUTH Error: status code != 302. Response:\n" + JSON.stringify(response.toJSON()));
                    }
                    reject(body.statusMessage);
                }
            });
        });
    };
    /**
     * return a list of all members
     * @param request
     * @param response
     * @param next
     */
    NamiAPI.getAllMemberForGroup = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = (_a = response.status(200)).json;
                        return [4 /*yield*/, NamiAPI.getAllMembers(request.query.filterString)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _c.sent();
                        response.status(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get all details from one member
     * @param request
     * @param response
     * @param next
     */
    NamiAPI.getOneMemberFromGroupById = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = (_a = response.status(200)).json;
                        return [4 /*yield*/, NamiAPI.getOneMember(request.params.id)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _c.sent();
                        response.status(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    NamiAPI.getEmailsByFilter = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var emailArray, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, NamiAPI.getAllEmailsByFilter(request.query.filter)];
                    case 1:
                        emailArray = _a.sent();
                        // @ts-ignore
                        response.status(200).json({ list: emailArray.map(function (email) { return email.email; }).join(','), objects: emailArray });
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        response.status(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * return name and id for all members
     * @param filterString
     */
    NamiAPI.getAllMembers = function (filterString) {
        if (filterString === void 0) { filterString = null; }
        return new Promise(function (resolve) {
            NamiAPI.nami.startSession().then(function () {
                if (NamiAPI.nami.status !== Status.CONNECTED) {
                    throw new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Nami: Authenticate before trying to search");
                }
                var params = {
                    page: 1,
                    start: 0,
                    limit: 999999
                };
                var query = "";
                if (filterString) {
                    query = '?filterString=' + filterString;
                }
                apiClient.get({
                    url: NamiAPI.nami.host + "/ica/rest/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/" + NamiAPI.nami.groupId + query,
                    qs: params,
                    useQueryString: true,
                    jar: NamiAPI.nami.cookieJar
                }, function (error, namiResponse, body) {
                    resolve(JSON.parse(body).data);
                });
            }, function (error) {
                throw new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
            });
        });
    };
    /**
     * return all data from one member
     * @param memberId
     */
    NamiAPI.getOneMember = function (memberId) {
        return new Promise(function (resolve, reject) {
            NamiAPI.nami.startSession().then(function () {
                if (NamiAPI.nami.status !== Status.CONNECTED) {
                    throw new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Nami: Authenticate before trying to search");
                }
                var params = {
                    page: 1,
                    start: 0,
                    limit: 999999
                };
                apiClient.get({
                    url: NamiAPI.nami.host + "/ica/rest/api/" + NamiAPI.nami.apiMajor + "/" + NamiAPI.nami.apiMinor + "/service/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/" + NamiAPI.nami.groupId + "/" + memberId,
                    qs: params,
                    useQueryString: true,
                    jar: NamiAPI.nami.cookieJar
                }, function (error, namiResponse, body) {
                    resolve(JSON.parse(body).data);
                });
            }, function (error) {
                throw new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
            });
        });
    };
    /**
     * return a array of with emails from the member
     * @param memberId
     */
    NamiAPI.getAllEmailsById = function (memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emails = [];
                        return [4 /*yield*/, NamiAPI.getOneMember(memberId)];
                    case 1:
                        member = _a.sent();
                        if (member['email']) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiMember,
                                email: member['vorname'] + " " + member['nachname'] + " <" + member['email'] + ">"
                            });
                        }
                        if (member['emailVertretungsberechtigter']) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiVertretungsberechtigter,
                                email: "Fam. " + member['nachname'] + " <" + member['emailVertretungsberechtigter'] + ">"
                            });
                        }
                        //hint it is possible to save text/email in telefax or telefon
                        if (_helper_1._helper.matchEmailRegex(member['telefax']).length) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiSonstige,
                                email: member['telefax']
                            });
                        }
                        if (_helper_1._helper.matchEmailRegex(member['telefon3']).length) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiSonstige,
                                email: member['telefon3']
                            });
                        }
                        if (_helper_1._helper.matchEmailRegex(member['telefon2']).length) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiSonstige,
                                email: member['telefon2']
                            });
                        }
                        if (_helper_1._helper.matchEmailRegex(member['telefon1']).length) {
                            emails.push({
                                childName: member['vorname'],
                                familyName: member['nachname'],
                                emailSource: mailController_1.EmailSource.NamiSonstige,
                                email: member['telefon1']
                            });
                        }
                        return [2 /*return*/, emails];
                }
            });
        });
    };
    /**
     * get all emails from all members (by filter) and return a array
     * @param filter
     */
    NamiAPI.getAllEmailsByFilter = function (filter) {
        var _this = this;
        if (filter === void 0) { filter = null; }
        return new Promise(function (resolve) {
            var emails = [];
            NamiAPI.getAllMembers(filter).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                var i, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(i < data.length)) return [3 /*break*/, 4];
                            // @ts-ignore
                            console.log('Email-Adressen werden geladen: ' + Math.round((i + 1) / data.length * 100) + '%');
                            _b = (_a = emails).concat;
                            return [4 /*yield*/, NamiAPI.getAllEmailsById(data[i]['id'])];
                        case 2:
                            emails = _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4:
                            resolve(emails);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    NamiAPI.nami = new NamiAPI(config_1.Config.nami.user, config_1.Config.nami.pass, config_1.Config.nami.gruppierung);
    return NamiAPI;
}());
exports.NamiAPI = NamiAPI;
//# sourceMappingURL=namiController.js.map