import {Router} from "express";

import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

import {GroupController} from "../../controller/groupController";

class Group {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token, permission, GroupController.getGroups)
            .post(token, permission, GroupController.newGroup)
            .put(token, permission, GroupController.updateGroup)
            .delete(token, permission, GroupController.deleteGroups);

        this.router.route('/lesson')
            .get(token, permission, GroupController.getGroupLessons)
            .post(token, permission, GroupController.newGroupLesson)
            .put(token, permission, GroupController.changeGroupLesson);

    }
}


const groupRouter = new Group();
groupRouter.init();

export default groupRouter.router;
