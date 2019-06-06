import {Router} from "express";

import {CalendarController} from "../../controller/calendarController";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

class Calendar {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token, permission, CalendarController.getAllEvents)
            .post(token, permission, CalendarController.createNewEvent)
            .put(token, permission, CalendarController.updateEvent)
            .delete(token, permission, CalendarController.deleteAllEvents);

        this.router.route('/:id')
            .delete(token, permission, CalendarController.deleteEvent);

        this.router.route('/public')
            .get(CalendarController.getAllPublicEvents);

        this.router.route('/lesson')
            .get(token, permission, CalendarController.getGroupLessons)
            .post(token, permission, CalendarController.newGroupLesson)
            .put(token, permission, CalendarController.changeGroupLesson);

        this.router.route('/lesson/:id')
            .delete(token, permission, CalendarController.deleteGroupLesson);
    }
}


const calendarRouter = new Calendar();
calendarRouter.init();

export default calendarRouter.router;
