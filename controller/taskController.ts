import {ErrorREST, Errors} from '../errors';
import {_helper, _helper as Helper} from './_helper';
import {Task} from '../models/taskModel';

//todo error handling in allen Methoden

export class TaskController {

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async getTaskRoute(request, response, next) {
        response.json(await TaskController.getTasks());
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async deleteTaskRoute(request, response, next) {
        response.json(await TaskController.deleteTask(request.query.id));
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async newTaskRoute(request, response, next) {
        response.json(await TaskController.newTask(request.body.title, request.body.description, request.body.dueDate ? new Date(request.body.dueDate) : null, request.body.priority ? request.body.priority : null, request.body.competent ? request.body.competent : [request.decoded.userID]));
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async checkTaskRoute(request, response, next) {
        response.json(await TaskController.checkTask(request.query.id));

    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async editTaskRoute(request, response, next) {
        response.json(await TaskController.editTask(request.query.id, request.body.title, request.body.description, request.body.dueDate, request.body.report, request.body.competent, request.body.done));

    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async addTaskReportRoute(request, response, next) {
        response.json(await TaskController.addReport(request.query.id, request.body.report));

    }

    /**
     * hint debug
     * return all tasks
     */
    private static getTasks(): Promise<object> {
        return new Promise((resolve, reject) => {
            Task.find()
                .sort({'dueDate': 1})
                .populate('competent')
                .then(data => {
                    resolve(data);
                });
        });
    }

    /**
     * create a new Task
     * @param title
     * @param description
     * @param dueDate
     * @param priority
     * @param competent
     */
    public static newTask(title: string, description: string, dueDate: Date = null, priority: number = null, competent: string[] = null): Promise<object> {
        return new Promise((resolve, reject) => {
            let task = new Task({
                title: title,
                description: description,
                dueDate: dueDate,
                competent: competent,
                priority: priority ? priority : 3
            });

            task.validate(async err => {
                if (err) {
                    for (let errName in err.errors) {
                        if (err.errors[errName].name === 'ValidatorError') {
                            console.log(Errors.UnprocessableEntity + ' ' + err.errors[errName].message);
                            reject(err.errors[errName].message);
                        }
                    }
                }

                task.save().then(event => resolve(event));
            });
        });
    }

    /**
     * mark task as finish
     * @param id
     */
    private static checkTask(id: string): Promise<object> {
        return new Promise((resolve, reject) => {
            Task.findById(id, function (err, task) {
                if (task) {
                    task.done = true;
                    task.save().then(task => resolve(task));
                } else {
                    reject(err);
                }

            });
        });
    }

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
    private static editTask(id: string, title: string = null, description: string = null, dueDate: Date = null, report: string[] = null, competent: string[] = null, done: boolean = null): Promise<object> {
        return new Promise((resolve, reject) => {
            Task.findById(id, function (err, task) {
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

                    task.save().then(task => resolve(task));
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * add a report to Task
     * @param id
     * @param report
     */
    private static addReport(id: string, report: string): Promise<object> {
        return new Promise((resolve, reject) => {
            Task.findById(id, function (err, task) {
                if (task) {
                    task.report.push({text: report, date: new Date()});
                    task.save().then(task => resolve(task));
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * delete one task
     * @param id
     */
    private static async deleteTask(id: string) {
        return new Promise((resolve, reject) => {
            Task.deleteOne({_id: id}).then(event => resolve({removedElements: event}));
        });
    }
}
