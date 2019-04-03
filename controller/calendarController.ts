import {Errors, ErrorREST} from "../errors";
import * as config from '../config';
import {Event} from "../models/eventModel";

export class CalendarController {

    /**
     * list all existing events depends on filter in request body
     * todo filter by group / member
     * todo filter by timespan
     * todo filter by competent
     * todo filter by origin
     * todo filter by eventType
     * todo filter by visibility (public)
     * @param request
     * @param response
     * @param next
     */
    static getAllEvents(request, response, next) {
        //todo return only events for user -> filter
        Event.find().then(data => response.json(data)).catch(next);
    }

    /**
     * show all events for public (only public events and without user names)
     * todo get all and only public events
     * @param request
     * @param response
     * @param next
     */
    static getAllPublicEvents(request, response, next) {
        Event.find({'public': true}).then(data => response.json(data)).catch(next);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static createNewEvent(request, response, next) {
        let startDateTime: Date = CalendarController.calculateStartDate(request.body.startDate);
        let endDateTime: Date = CalendarController.calculateEndDate(startDateTime, request.body.endDate);
        if (endDateTime == null) {
            return next(new ErrorREST(Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
        }
        let userId = request.decoded.userID;
        let userRole = request.decoded.role;

        let event = new Event({
            public: request.body.public,
            origin: /* todo validate origin */ request.body.origin,
            type: 'event',
            eventName: request.body.eventName,
            dateStart: startDateTime,
            dateEnd: endDateTime,
            description: request.body.discription,
            competent: /* todo validate complements */ request.body.complement,
            member: /* todo validate members */ request.body.member,
            address: /* todo validate address */ request.body.address,
            attachments: {
                document: /* todo validate documents */ request.body.documents,
                picture:  /* todo validate picture */ request.body.picture
            },
            creator: userId
        });

        event.validate(async err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError') {
                        console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                    }

            let eventCollision = CalendarController.checkEventCollision(event);

            if (eventCollision.status) {
                //todo do some magic and make a confirmation from client possible
                console.log(eventCollision.message);
                return response.status().json(eventCollision.message);
            }

            await event.save().then(event => response.status(200).json(event)).catch(next);
        });
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static updateEvent(request, response, next) {

    }

    /**
     * check if the new event collide with an existing event
     * @param event
     */
    private static checkEventCollision(event: Event) {
        let status = false;
        let message = "Not Checked";

        let message_groupLesson = "The Event collide with a group lesson.";
        let message_holiday = "Your selected event is during the holidays.";
        let message_groupEvent = "The Event collide with an other event for this group.";
        let message_event = "The Event collide with an other event";
        let message_competent = "The competent for this event is not available";

        return {status: status, message: message};
    }

    /**
     * check the format (only day or with hour/minute) of the given date
     * @return Date
     * @param startDate
     */
    private static calculateStartDate(startDate: string): Date {
        return new Date(startDate);
    }

    /**
     * check the format of the given endDate
     * @return endDate
     * @param startDate
     * @param endDate
     */
    private static calculateEndDate(startDate: Date, endDate: string): Date {
        let end = new Date(endDate);

        if (end != null && startDate <= end) {
            return end;
        }

        return null;
    }
}
