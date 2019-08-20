import {ErrorREST, Errors} from "../errors";
import {_helper, _helper as Helper} from "./_helper";
import {Task} from "../models/taskModel";

export class TaskController {

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static newTaskRoute(request, response, next) {
        this.newTask(request.body.title, request.body.description, new Date(request.body.dueDate), request.body.competent)
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static checkTaskRoute(request, response, next) {
        this.checkTask(request.query.id)
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static editTaskRoute(request, response, next) {
        this.editTask(request.query.id ,request.body.title, request.body.description, new Date(request.body.dueDate),request.body.report, request.body.competent,request.body.done)
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static addTaskReportRoute(request, response, next) {
        this.addReport(request.query.id, request.body.report)
    }

    /**
     * create a new Task
     * @param title
     * @param description
     * @param dueDate
     * @param competent
     */
    public static newTask(title: string, description: string, dueDate: Date, competent: string[]) {

    }

    /**
     * mark task as finish
     * @param id
     */
    private static checkTask(id: string) {

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
    private static editTask(id:string ,title: string, description: string, dueDate: Date, report: string, competent: string[], done: boolean) {

    }

    /**
     * add a report to Task
     * @param id
     * @param report
     */
    private static addReport(id:string, report:string){

    }

}
