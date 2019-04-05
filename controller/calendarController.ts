import {Errors, ErrorREST} from "../errors";
import * as config from '../config';
import {Event} from "../models/eventModel";

export class CalendarController {

    /**
     * list all existing events depends on filter in request body
     * @param request
     * @param response
     * @param next
     */
    static getAllEvents(request, response, next) {
        let filterDateStart = request.query.dateStart;
        let filterDateEnd = request.query.dateEnd;
        let filterComplement = request.query.complement;
        let filterOrigin = request.query.origin;
        let filterGroup = request.query.group;
        let filterType = request.query.type;

        let today = new Date();

        let filter = [];
        if (filterDateStart != undefined) {
            filter.push({'dateStart': {"$gte": filterDateStart}});
        } else {
            filter.push({'dateStart': {"$gte": today.setDate(today.getDate() - config.Config.calender.public_event_daysPast)}});
        }

        if (filterDateEnd != undefined) {
            filter.push({'dateEnd': {"$lt": filterDateEnd}});
        } else {
            filter.push({'dateEnd': {"$lt": today.setDate(today.getDate() + config.Config.calender.public_event_daysFuture)}});
        }

        if (filterComplement != null) {
            filter.push({'competent': {$in: filterComplement}});
        }

        if (filterOrigin != null) {
            filter.push({'origin': filterOrigin});
        }

        if (filterType != null) {
            filter.push({'type': filterType});
        }

        if (filterGroup != null) {
            filter.push({'member': {$in: filterGroup}});
        } else {
            if (request.decoded.role != 'admin')
            //if admin then show all events -> dont filter
                filter.push({'member': request.decoded.role});
        }

        Event.find({$and: filter}).then(data => response.json(data)).catch(next);
    }

    /**
     * show all events for public (only public events and without user names)
     * @param request
     * @param response
     * @param next
     */
    static getAllPublicEvents(request, response, next) {
        let today = new Date();
        let filterStart = today.setDate(today.getDate() - config.Config.calender.public_event_daysPast);
        let filterEnd = today.setDate(today.getDate() + config.Config.calender.public_event_daysFuture);
        Event.find({'public': true, 'dateEnd': {"$gte": filterStart, "$lt": filterEnd}}, {
            competent: 0,
            creator: 0,
            lastEdit: 0,
            public: 0
        }).then(data => response.json(data)).catch(next);
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

        let event = new Event({
            public: request.body.public,
            origin: /* todo validate origin */ request.body.origin,
            type: 'event',
            eventName: request.body.eventName,
            dateStart: startDateTime,
            dateEnd: endDateTime,
            description: request.body.discription,
            competent: /* todo validate complements */ request.body.complement,
            groups: /* todo validate groups */ request.body.groups,
            address: /* todo validate address */ request.body.address,
            attachments: {
                document: /* todo validate documents */ request.body.documents,
                picture:  /* todo validate picture */ request.body.picture
            },
            creator: userId,
        });

        event.validate(async err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError') {
                        console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                    }

            let eventCollision = CalendarController.willEventCollide(event);

            if (eventCollision.status) {
                //todo do some magic and make a confirmation from client possible
                console.log(eventCollision.message);
                return response.status().json(eventCollision.message);
            }

            await event.save().then(event => response.status(200).json(event)).catch(next);
        });
    }

    /**
     *todo
     * @param request
     * @param response
     * @param next
     */
    static updateEvent(request, response, next) {
        Event.findById(request.body.id, async function (err, event) {
            if (event) {
                if (request.body.public != undefined) {
                    event.public = request.body.public;
                }
                if (request.body.eventName != undefined) {
                    event.eventName = request.body.eventName;
                }
                if (request.body.dateStart != undefined) {
                    let startDateTime: Date = CalendarController.calculateStartDate(request.body.startDate);
                    let endDateTime: Date = CalendarController.calculateEndDate(startDateTime, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new ErrorREST(Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    } else {
                        event.startDate = startDateTime;
                        event.endDate = endDateTime;
                    }
                }else if(request.body.dateEnd != undefined){
                    let endDateTime: Date = CalendarController.calculateEndDate(event.startDate, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new ErrorREST(Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    } else {
                        event.endDate = endDateTime;
                    }
                }
                if (request.body.description != undefined) {
                    event.description = request.body.description;
                }

                //todo remove later
                if (request.body.complement != undefined || request.body.groups != undefined || request.body.address != undefined || request.body.origin != undefined || request.body.documents != undefined || request.body.picture != undefined) {
                    return next(new ErrorREST(Errors.NoContent), "A part of the request cannot be resolved, the functionality is not implemented yet. Event did not changed.");
                }

                //todo change complement
                //todo change member
                //todo change address
                //todo change attachments
                //todo change origin?

                event.lastEdit = request.decoded.userID;
                await event.save().then(event => response.status(200).json(event)).catch(next);
            } else {
                return next(new ErrorREST(Errors.UnprocessableEntity, "The event could not be found"));
            }
        });
    }

    /**
     * check if the new event collide with an existing event
     * @param event
     */
    private static willEventCollide(event: Event) {
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
