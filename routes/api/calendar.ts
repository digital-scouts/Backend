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
            .get(token, permission, CalendarController.getAllEvents())
            .post(token, permission, CalendarController.createNewEvent())
            .put(token, permission, CalendarController.updateEvent());

        this.router.route('/:id')
            .get(token, permission, CalendarController.getAllEventsForId());

        this.router.route('/public')
            .get(CalendarController.getAllPublicEvents());

    }
}


const calendarRouter = new Calendar();
calendarRouter.init();

export default calendarRouter.router;
