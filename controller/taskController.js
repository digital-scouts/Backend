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
var taskModel_1 = require("../models/taskModel");
//todo error handling in allen Methoden
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    TaskController.getTaskRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.getTasks()];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
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
    TaskController.deleteTaskRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.deleteTask(request.query.id)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
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
    TaskController.newTaskRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.newTask(request.body.title, request.body.description, request.body.dueDate ? new Date(request.body.dueDate) : null, request.body.priority ? request.body.priority : null, request.body.competent ? request.body.competent : [request.decoded.userID])];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
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
    TaskController.checkTaskRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.checkTask(request.query.id)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
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
    TaskController.editTaskRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.editTask(request.query.id, request.body.title, request.body.description, request.body.dueDate, request.body.report, request.body.competent, request.body.done)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
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
    TaskController.addTaskReportRoute = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = response).json;
                        return [4 /*yield*/, TaskController.addReport(request.query.id, request.body.report)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * hint debug
     * return all tasks
     */
    TaskController.getTasks = function () {
        return new Promise(function (resolve, reject) {
            taskModel_1.Task.find()
                .sort({ 'dueDate': 1 })
                .populate('competent')
                .then(function (data) {
                resolve(data);
            });
        });
    };
    /**
     * create a new Task
     * @param title
     * @param description
     * @param dueDate
     * @param priority
     * @param competent
     */
    TaskController.newTask = function (title, description, dueDate, priority, competent) {
        var _this = this;
        if (dueDate === void 0) { dueDate = null; }
        if (priority === void 0) { priority = null; }
        if (competent === void 0) { competent = null; }
        return new Promise(function (resolve, reject) {
            var task = new taskModel_1.Task({
                title: title,
                description: description,
                dueDate: dueDate,
                competent: competent,
                priority: priority ? priority : 3
            });
            task.validate(function (err) { return __awaiter(_this, void 0, void 0, function () {
                var errName;
                return __generator(this, function (_a) {
                    if (err) {
                        for (errName in err.errors) {
                            if (err.errors[errName].name === 'ValidatorError') {
                                console.log(errors_1.Errors.UnprocessableEntity + ' ' + err.errors[errName].message);
                                reject(err.errors[errName].message);
                            }
                        }
                    }
                    task.save().then(function (event) { return resolve(event); });
                    return [2 /*return*/];
                });
            }); });
        });
    };
    /**
     * mark task as finish
     * @param id
     */
    TaskController.checkTask = function (id) {
        return new Promise(function (resolve, reject) {
            taskModel_1.Task.findById(id, function (err, task) {
                if (task) {
                    task.done = true;
                    task.save().then(function (task) { return resolve(task); });
                }
                else {
                    reject(err);
                }
            });
        });
    };
    /**
     * edit existing Task
     * @param id
     * @param title
     * @param description
     * @param dueDate
     * @param report
     * @param competent
     * @param done
     */
    TaskController.editTask = function (id, title, description, dueDate, report, competent, done) {
        if (title === void 0) { title = null; }
        if (description === void 0) { description = null; }
        if (dueDate === void 0) { dueDate = null; }
        if (report === void 0) { report = null; }
        if (competent === void 0) { competent = null; }
        if (done === void 0) { done = null; }
        return new Promise(function (resolve, reject) {
            taskModel_1.Task.findById(id, function (err, task) {
                if (task) {
                    if (title && task.title != title) {
                        task.title = title;
                    }
                    if (description && task.description != description) {
                        task.description = description;
                    }
                    if (dueDate && dueDate instanceof Date && task.dueDate != dueDate) {
                        task.dueDate = dueDate;
                    }
                    if (report && task.report != report) {
                        task.report = report;
                    }
                    if (competent && task.competent != competent) {
                        task.competent = competent;
                    }
                    if (done && task.done != done) {
                        task.done = done;
                    }
                    task.save().then(function (task) { return resolve(task); });
                }
                else {
                    reject(err);
                }
            });
        });
    };
    /**
     * add a report to Task
     * @param id
     * @param report
     */
    TaskController.addReport = function (id, report) {
        return new Promise(function (resolve, reject) {
            taskModel_1.Task.findById(id, function (err, task) {
                if (task) {
                    task.report.push({ text: report, date: new Date() });
                    task.save().then(function (task) { return resolve(task); });
                }
                else {
                    reject(err);
                }
            });
        });
    };
    /**
     * delete one task
     * @param id
     */
    TaskController.deleteTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        taskModel_1.Task.deleteOne({ _id: id }).then(function (event) { return resolve({ removedElements: event }); });
                    })];
            });
        });
    };
    return TaskController;
}());
exports.TaskController = TaskController;
//# sourceMappingURL=taskController.js.map