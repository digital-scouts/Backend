import {Router} from "express";

import {TaskController} from "../../controller/taskController";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

class Task {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token, permission, TaskController.getTaskRoute)
            .post(token, permission, TaskController.newTaskRoute)
            .put(token, permission, TaskController.editTaskRoute)
            .delete(token, permission, TaskController.deleteTaskRoute);

        this.router.route('/done')
            .put(token, permission, TaskController.checkTaskRoute);

        this.router.route('/report')
            .put(token, permission, TaskController.addTaskReportRoute);
    }
}


const taskRouter = new Task();
taskRouter.init();

export default taskRouter.router;
