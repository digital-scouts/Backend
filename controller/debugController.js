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
var groupLessonModel_1 = require("../models/groupLessonModel");
var addressModel_1 = require("../models/addressModel");
var chatModel_1 = require("../models/chatModel");
var eventModel_1 = require("../models/eventModel");
var documentModel_1 = require("../models/documentModel");
var messageModel_1 = require("../models/messageModel");
var notificationModel_1 = require("../models/notificationModel");
var taskModel_1 = require("../models/taskModel");
var DebugController = /** @class */ (function () {
    function DebugController() {
    }
    DebugController.initData = function (request, response, next) {
        var res = [];
        //Wöe leader + group
        var user = new userModel_1.User({
            name_first: 'Jacob',
            name_last: 'Inzelmann',
            email: 'inzelmann@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Wölflinge',
                color: 'orange',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Kasper',
                    name_last: 'Stand',
                    email: 'woe1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Kazimir',
                    name_last: 'Stand',
                    email: 'woe2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //jufi leader + group
        user = new userModel_1.User({
            name_first: 'Sonja',
            name_last: 'Schöpff',
            email: 'schoepff@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Jungpfadfinder',
                color: 'blue',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Lena',
                    name_last: 'Calmer',
                    email: 'jufi1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Jona',
                    name_last: 'Elze',
                    email: 'jufi2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //pfadi leader+ group
        user = new userModel_1.User({
            name_first: 'Karolin',
            name_last: 'Ferner',
            email: 'ferner@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Pfadfinder',
                color: 'green',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Paula',
                    name_last: 'Calmer',
                    email: 'pfadi1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Ronja',
                    name_last: 'Räubertochter',
                    email: 'pfadi2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //rover group
        var group = new groupModel_1.Group({
            name: 'Rover',
            color: 'red',
        });
        group.save().then(function (data) {
            var user = new userModel_1.User({
                name_first: 'Svantje',
                name_last: 'Grohn',
                email: 'rover1@mail.de',
                password: '1234Ee!!!!',
                role: 'member',
                group: data._id,
                accountStatus: {
                    activated: true
                }
            });
            user.save();
            user = new userModel_1.User({
                name_first: 'Nele',
                name_last: 'Grohn',
                email: 'rover2@mail.de',
                password: '1234Ee!!!!',
                role: 'member',
                group: data._id,
                accountStatus: {
                    activated: true
                }
            });
            user.save();
        });
        //admin
        user = new userModel_1.User({
            name_first: 'Janneck',
            name_last: 'Lange',
            email: 'lange@mail.de',
            password: '1234Ee!!!!',
            role: 'admin',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) { return res.push(data); });
        response.status(200).json(res);
    };
    DebugController.deleteDB = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        res = [];
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, userModel_1.User.deleteMany().then(function (data) { return res.push(data); })];
                    case 1:
                        _c = [
                            _d.sent()
                        ];
                        return [4 /*yield*/, groupModel_1.Group.deleteMany().then(function (data) { return res.push(data); })];
                    case 2:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, groupLessonModel_1.GroupLesson.deleteMany().then(function (data) { return res.push(data); })];
                    case 3:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, addressModel_1.Address.deleteMany().then(function (data) { return res.push(data); })];
                    case 4:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, chatModel_1.Chat.deleteMany().then(function (data) { return res.push(data); })];
                    case 5:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, eventModel_1.Event.deleteMany().then(function (data) { return res.push(data); })];
                    case 6:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, documentModel_1.Document.deleteMany().then(function (data) { return res.push(data); })];
                    case 7:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, messageModel_1.TextMessage.deleteMany().then(function (data) { return res.push(data); })];
                    case 8:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, notificationModel_1.Notification.deleteMany().then(function (data) { return res.push(data); })];
                    case 9:
                        _c = _c.concat([
                            _d.sent()
                        ]);
                        return [4 /*yield*/, taskModel_1.Task.deleteMany().then(function (data) { return res.push(data); })];
                    case 10:
                        _b.apply(_a, [_c.concat([
                                _d.sent()
                            ])]).then(function () {
                            response.status(200).json(res);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return DebugController;
}());
exports.DebugController = DebugController;
//# sourceMappingURL=debugController.js.map