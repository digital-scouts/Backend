"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var calendarController_1 = require("../../controller/calendarController");
var token_1 = require("../token");
var permission_1 = require("../permission");
var Calendar = /** @class */ (function () {
    function Calendar() {
        this.router = express_1.Router();
        this.init();
    }
    Calendar.prototype.init = function () {
        this.router.route('/debug')
            .get(calendarController_1.CalendarController.getAllEventsDebug);
        this.router.route('/')
            .get(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.getAllEvents)
            .post(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.createNewEvent)
            .put(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.updateEvent)
            .delete(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.deleteEvent);
        this.router.route('/feedback')
            .post(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.feedback);
        this.router.route('/public')
            .get(calendarController_1.CalendarController.getAllPublicEvents);
        this.router.route('/lesson')
            .get(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.getGroupLessons)
            .post(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.newGroupLesson)
            .delete(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.deleteAllGroupLessons);
        //.put(token, permission, CalendarController.changeGroupLesson);
        this.router.route('/lesson/:id')
            .delete(token_1.verifyToken, permission_1.checkPermission, calendarController_1.CalendarController.deleteGroupLesson);
    };
    return Calendar;
}());
var calendarRouter = new Calendar();
calendarRouter.init();
exports.default = calendarRouter.router;
//# sourceMappingURL=calendar.js.map