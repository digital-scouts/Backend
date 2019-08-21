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
var groupModel_1 = require("../models/groupModel");
var groupLessonModel_1 = require("../models/groupLessonModel");
var _helper_1 = require("./_helper");
var GroupController = /** @class */ (function () {
    function GroupController() {
    }
    /**
     * send all groups unfiltered
     * @param request
     * @param response
     * @param next
     */
    GroupController.getGroups = function (request, response, next) {
        groupModel_1.Group.find().then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * send the new group
     * @param request
     * @param response
     * @param next
     */
    GroupController.newGroup = function (request, response, next) {
        var _this = this;
        _helper_1._helper.getActiveLeadersByArray(request.body.leader).then(function (leaders) {
            var group = new groupModel_1.Group({
                name: request.body.name,
                leader: leaders,
                logo: request.body.logo,
                creator: request.decoded.userID,
                color: request.body.color,
            });
            group.validate(function (err) { return __awaiter(_this, void 0, void 0, function () {
                var errName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                for (errName in err.errors)
                                    if (err.errors[errName].name === 'ValidatorError') {
                                        console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                                        return [2 /*return*/, next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message))];
                                    }
                            return [4 /*yield*/, group.save().then(function (event) { return response.status(200).json(event); }).catch(next)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /**
     * delete all groups and all GroupLessons
     * @param request
     * @param response
     * @param next
     */
    GroupController.deleteGroups = function (request, response, next) {
        groupModel_1.Group.deleteMany().then(function (groupData) {
            groupLessonModel_1.GroupLesson.deleteMany().then(function (lessonData) { return response.json({
                groups: groupData,
                groupLessons: lessonData
            }); }).catch(next);
        }).catch(next);
    };
    /**
     * delete a specific group and all related groupLessons
     * @param request
     * @param response
     * @param next
     */
    GroupController.deleteGroup = function (request, response, next) {
        groupModel_1.Group.remove({ _id: request.params.id }).then(function (groupData) {
            if (groupData.n > 0) {
                groupLessonModel_1.GroupLesson.deleteMany({ group: request.params.id }).then(function (lessonData) { return response.json({
                    groups: groupData,
                    groupLessons: lessonData
                }); }).catch(next);
            }
        }).catch(next);
    };
    /**
     * @param request
     * @param response
     * @param next
     */
    GroupController.updateGroup = function (request, response, next) {
        var anyChanges = false;
        groupModel_1.Group.findById(request.body.id, function (err, group) {
            if (group) {
                if (request.body.name != undefined && request.body.name != group.name) {
                    group.name = request.body.name;
                    anyChanges = true;
                }
                if (request.body.leader != undefined && request.body.leader != group.leader) {
                    group.leader = _helper_1._helper.getActiveLeadersByArray(request.body.leader);
                    anyChanges = true;
                }
                if (request.body.logo != undefined && request.body.logo != group.logo) {
                    group.logo = request.body.logo;
                    anyChanges = true;
                }
                if (request.body.color != undefined && request.body.color != group.color) {
                    group.color = request.body.color;
                    anyChanges = true;
                }
                if (request.body.defaultForRole != undefined && request.body.defaultForRole != group.defaultForRole) {
                    //todo check if group exist in config
                    group.defaultForRole = request.body.defaultForRole;
                    anyChanges = true;
                }
                if (request.body.childGroup != undefined && request.body.childGroup != group.childGroup) {
                    group.childGroup = request.body.childGroup;
                    anyChanges = true;
                }
                if (anyChanges) {
                    group.lastEdit = request.decoded.userID;
                    group.save().then(function (group) { return response.status(200).json(group); }).catch(next);
                }
                else {
                    response.status(200).json("No Changes");
                }
            }
            else {
                return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The group could not be found"));
            }
        });
    };
    return GroupController;
}());
exports.GroupController = GroupController;
//# sourceMappingURL=groupController.js.map