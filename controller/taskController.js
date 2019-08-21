"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    TaskController.newTaskRoute = function (request, response, next) {
        this.newTask(request.body.title, request.body.description, new Date(request.body.dueDate), request.body.competent);
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    TaskController.checkTaskRoute = function (request, response, next) {
        this.checkTask(request.query.id);
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    TaskController.editTaskRoute = function (request, response, next) {
        this.editTask(request.query.id, request.body.title, request.body.description, new Date(request.body.dueDate), request.body.report, request.body.competent, request.body.done);
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    TaskController.addTaskReportRoute = function (request, response, next) {
        this.addReport(request.query.id, request.body.report);
    };
    /**
     * create a new Task
     * @param title
     * @param description
     * @param dueDate
     * @param competent
     */
    TaskController.newTask = function (title, description, dueDate, competent) {
    };
    /**
     * mark task as finish
     * @param id
     */
    TaskController.checkTask = function (id) {
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
    };
    /**
     * add a report to Task
     * @param id
     * @param report
     */
    TaskController.addReport = function (id, report) {
    };
    return TaskController;
}());
exports.TaskController = TaskController;
//# sourceMappingURL=taskController.js.map