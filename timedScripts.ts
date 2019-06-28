import {CronJob} from 'cron';
import {CalendarController} from "./controller/calendarController";
import {GroupLesson} from "./models/groupLessonModel";

class timedScripts {

    public static startScripts() {
        timedScripts.addRegularTimedGroupLessonEvents();
    }

    private static addRegularTimedGroupLessonEvents() {
        // every 1st day of month
        //todo need to be tested
        new CronJob('0 0 1 * * *', () => {
            console.log("monthly Job: add regular timed groupLessonEvents");

            GroupLesson.find(/* todo find all not finished */).then(groupLessons => {
                groupLessons.forEach(groupLesson => {
                    CalendarController.createNewGroupLessonEvents(groupLesson);
                })
            });
        }, () => {
            console.log('job is done')
        }, true, 'Europe/Berlin');
    }

}

export {timedScripts};

