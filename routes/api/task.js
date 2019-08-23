"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var taskController_1 = require("../../controller/taskController");
var token_1 = require("../token");
var permission_1 = require("../permission");
var Task = /** @class */ (function () {
    function Task() {
        this.router = express_1.Router();
        this.init();
    }
    Task.prototype.init = function () {
        this.router.route('/')
            .get(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.getTaskRoute)
            .post(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.newTaskRoute)
            .put(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.editTaskRoute)
            .delete(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.deleteTaskRoute);
        this.router.route('/done')
            .put(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.checkTaskRoute);
        this.router.route('/report')
            .put(token_1.verifyToken, permission_1.checkPermission, taskController_1.TaskController.addTaskReportRoute);
    };
    return Task;
}());
var taskRouter = new Task();
taskRouter.init();
exports.default = taskRouter.router;
//# sourceMappingURL=task.js.map