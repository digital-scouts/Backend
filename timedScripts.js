"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cron_1 = require("cron");
var calendarController_1 = require("./controller/calendarController");
var groupLessonModel_1 = require("./models/groupLessonModel");
var timedScripts = /** @class */ (function () {
    function timedScripts() {
    }
    timedScripts.startScripts = function () {
        timedScripts.addRegularTimedGroupLessonEvents();
        timedScripts.searchForInactiveUsers();
    };
    /**
     * Add next upcoming Group Lessons to calendar
     * At 00:00 on day-of-month 1.
     */
    timedScripts.addRegularTimedGroupLessonEvents = function () {
        // every 1st day of month
        //todo need to be tested
        new cron_1.CronJob('0 0 1 * *', function () {
            console.log("monthly Job: add regular timed groupLessonEvents");
            groupLessonModel_1.GroupLesson.find( /* todo find all not finished */).then(function (groupLessons) {
                groupLessons.forEach(function (groupLesson) {
                    calendarController_1.CalendarController.createNewGroupLessonEvents(groupLesson);
                });
            });
        }, function () {
            console.log('job is done');
        }, true, 'Europe/Berlin');
    };
    /**
     * Search Inactive Users and update them in DB
     * At 00:00 on Sunday.
     */
    timedScripts.searchForInactiveUsers = function () {
        new cron_1.CronJob('0 0 * * 0', function () {
            console.log("weekly Job: search for inactive users");
            //todo
        }, function () {
            console.log('job is done');
        }, true, 'Europe/Berlin');
    };
    return timedScripts;
}());
exports.timedScripts = timedScripts;
