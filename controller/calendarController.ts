import {Errors, ErrorREST} from "../errors";
import * as config from '../config';
import {Event} from "../models/eventModel";
import {_helper as Helper} from "./_helper";
import {GroupLesson} from "../models/groupLessonModel";
import * as moment from 'moment';
import {HolidayController} from './holidayController'

export class CalendarController {

    static getAllEventsDebug(request, response, next) {
        Event.find()
            .sort({'dateStart': 1})
            .populate('groups')
            .then(data => {
                let rData = {};

                data.forEach(event => {
                    let date = new Date(event.dateStart).toISOString().split('T')[0];//ISO Date without time
                    if (!rData.hasOwnProperty(date)) {
                        rData[date] = [];
                    }
                    rData[date].push(event);
                });
                response.json(rData)
            }).catch(next);
    }
    /**
     * list all existing events depends on filter in request body
     * sort and group by dateStart
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
        if (filterDateStart != undefined && filterDateStart != 'null') {
            filter.push({'dateStart': {"$gte": filterDateStart}});
        } else {
            filter.push({'dateStart': {"$gte": today.setDate(today.getDate() - config.Config.calender.public_event_daysPast)}});
        }

        if (filterDateEnd != undefined && filterDateEnd != 'null') {
            filter.push({'dateEnd': {"$lt": filterDateEnd}});
        } else {
            filter.push({'dateEnd': {"$lt": today.setDate(today.getDate() + config.Config.calender.public_event_daysFuture)}});
        }

        if (filterComplement != null && filterComplement != 'null') {
            filter.push({'competent': {$in: filterComplement}});
        }

        if (filterOrigin != null && filterOrigin != 'null') {
            filter.push({'origin': filterOrigin});
        }

        if (filterType != null && filterType != 'null') {
            filter.push({'type': filterType});
        }

        if (filterGroup != null && filterGroup != 'null') {
            try {
                //try to use it like a array, when it fail use it as parameter and put it in array
                let l = filterGroup.length;
                filter.push({'groups': {$in: filterGroup}});
            } catch (ex) {
                filter.push({'groups': {$in: [filterGroup]}});
            }

        } else {
            if (request.decoded.role != 'admin')
            //if admin then show all events -> dont filter
                filter.push({'member': request.decoded.role});
        }

        Event.find({$and: filter}, {
            competent: 0, creator: 0, lastEdit: 0, public: 0, updatedAt: 0, createdAt: 0, attachments: 0, description: 0
        })
            .sort({'dateStart': 1})
            .populate('groups')
            .then(data => {
                let rData = {};

                data.forEach(event => {
                    let date = new Date(event.dateStart).toISOString().split('T')[0];//ISO Date without time
                    if (!rData.hasOwnProperty(date)) {
                        rData[date] = [];
                    }
                    rData[date].push(event);
                });
                response.json(rData)
            }).catch(next);
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
     * CAUTION: This will delete one Event
     * @param request
     * @param response
     * @param next
     */
    static deleteEvent(request, response, next) {
        Event.remove({_id: request.query.id}).then(event => response.json({removedElements: event})).catch(next);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static createNewEvent(request, response, next) {
        console.log('request.body.groups')
        console.log(request.body.groups)
        let startDateTime: Date = new Date(request.body.startDate);
        let endDateTime: Date = Helper.checkEndDate(startDateTime, request.body.endDate);
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
            competent: /* todo validate complements */ request.body.competent,
            groups: /* todo validate groups */ JSON.parse(request.body.groups),
            address: request.body.address,
            attachments: {
                document: request.body.documents,
                picture: request.body.picture
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
                //todo confirm and place element, cancel or move blocking element
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
        let anyChanges: boolean = false;
        Event.findById(request.body.id, function (err, event) {
            if (event) {
                if (request.body.public != undefined && request.body.public !== event.public) {
                    event.public = request.body.public;
                    anyChanges = true;
                }
                if (request.body.eventName != undefined && request.body.eventName != event.eventName) {
                    event.eventName = request.body.eventName;
                    anyChanges = true;
                }
                if (request.body.dateStart != undefined && request.body.dateStart != event.dateStart) {
                    let startDateTime: Date = new Date(request.body.startDate);
                    let endDateTime: Date = Helper.checkEndDate(startDateTime, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new ErrorREST(Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    } else {
                        event.startDate = startDateTime;
                        event.endDate = endDateTime;
                        anyChanges = true;
                    }
                } else if (request.body.dateEnd != undefined && request.body.dateEnd != event.dateEnd) {
                    let endDateTime: Date = Helper.checkEndDate(event.startDate, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new ErrorREST(Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    } else {
                        event.endDate = endDateTime;
                        anyChanges = true;
                    }
                }
                if (request.body.description != undefined && request.body.description != event.description) {
                    event.description = request.body.description;
                    anyChanges = true;
                }
                if (request.body.address != undefined && request.body.address != event.address) {
                    event.address = request.body.address;
                    anyChanges = true;
                }

                //todo remove later
                if (request.body.complement != undefined || request.body.groups != undefined || request.body.origin != undefined || request.body.documents != undefined || request.body.picture != undefined) {
                    return next(new ErrorREST(Errors.NoContent), "A part of the request cannot be resolved, the functionality is not implemented yet. Event did not changed.");
                }

                //todo change complement
                //todo change group
                //todo change attachments
                //todo change origin?

                if (anyChanges) {
                    event.lastEdit = request.decoded.userID;
                    event.save().then(event => response.status(200).json(event)).catch(next);
                } else {
                    response.status(200).json("No Changes")
                }

            } else {
                return next(new ErrorREST(Errors.UnprocessableEntity, "The event could not be found"));
            }
        });
    }

    /**
     * todo check if the new event collide with an existing event
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

    /*
    ****************************************** GROUP LESSON
     */

    /**
     * send all groupLessons unfiltered
     * @param request
     * @param response
     * @param next
     */
    static getGroupLessons(request, response, next) {
        GroupLesson.find().populate('group').then(data => response.json(data)).catch(next);
    }

    /**
     * create a new groupLesson
     * @param request
     * @param response
     * @param next
     */
    static newGroupLesson(request, response, next) {

        Helper.isGroupValid(request.body.group).then(isGroupValid => {
            if (isGroupValid) {
                let groupLesson = new GroupLesson({
                    group: request.body.group,
                    frequency: request.body.frequency,
                    startDate: request.body.startDate,
                    // end: (request.body.end == undefined) ? null : request.body.end,
                    duration: request.body.duration,
                    creator: request.decoded.userID
                });

                groupLesson.validate(err => {
                        if (err)
                            for (let errName in err.errors)
                                if (err.errors[errName].name === 'ValidatorError') {
                                    console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                                    return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                                }

                    groupLesson.save().then(groupLesson => {
                        CalendarController.createNewGroupLessonEvents(groupLesson);
                        response.status(200).json(groupLesson)
                        });
                    }
                );
            } else {
                return next(new ErrorREST(Errors.UnprocessableEntity, "The group is not valid."));
            }
        });
    }

    /**
     * set end of groupLessons and remove all following groupLesson events
     * todo validate end
     * todo remove all following groupLesson events
     * @param request
     * @param response
     * @param next
     */
    static finishGroupLessonPeriode(request, response, next) {
        GroupLesson.findById(request.body.id, function (err, lesson) {
            if (lesson && request.body.end != undefined && request.body.end != lesson.end) {
                lesson.end = request.body.end;
                lesson.lastEdit = request.decoded.userID;
                lesson.save().then(lesson => response.status(200).json(lesson)).then(() => {

                });
            } else {
                if (lesson) {
                    response.status(200).json("No Changes")
                } else {
                    return next(new ErrorREST(Errors.UnprocessableEntity, "The groupLesson could not be found"));
                }
            }
        });
    }

    /**
     * todo set groupLesson event to canceled
     * @param request
     * @param response
     * @param next
     */
    static cancelGroupLessonEvent(request, response, next) {

    }

    /**
     *
     * Warning: only for debug - delete a specific groupLesson
     * @param request
     * @param response
     * @param next
     */
    static deleteGroupLesson(request, response, next) {
        if (config.Config.DEBUG) {
            GroupLesson.remove({_id: request.params.id}).then(data => response.json(data)).catch(next);
        } else {
            return next(new ErrorREST(Errors.BadRequest, "This is only for debug, Debug is disabled"));
        }
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @return {any}
     */
    static deleteAllGroupLessons(request, response, next) {
        console.log('delete all')
        if (config.Config.DEBUG) {
            GroupLesson.remove().then(data => response.json(data)).catch(next);
        } else {
            return next(new ErrorREST(Errors.BadRequest, "This is only for debug, Debug is disabled"));
        }
    }

    /**
     * create all missing groupLessonEvents for the next (maxGroupLessonsEvents * frequency) days
     * @param groupLesson
     * @param maxGroupLessonsEvents
     */
    public static async createNewGroupLessonEvents(groupLesson, maxGroupLessonsEvents = 10) {
        let groupLessonStartMoment = moment(groupLesson.startDate);
        groupLessonStartMoment = (moment() > groupLessonStartMoment) ? moment().day(groupLessonStartMoment.day()).hour(groupLessonStartMoment.hour()).minute(groupLessonStartMoment.minute()) : groupLessonStartMoment;
        for (let i = 0, day = groupLessonStartMoment; i < maxGroupLessonsEvents; i++, day = groupLessonStartMoment.clone().add(groupLesson.frequency * i, 'd')) {
            console.log(`check if this lesson is already in events for ${day.format('DD.MM HH:mm')}`);

            if(!await HolidayController.isDateHolidayOrVacation(moment(day).format('YYYY-MM-DD'))){
                let filter = [];
                filter.push({'dateStart': {"$gte": day}});
                filter.push({'origin': groupLesson._id});

                Event.find({$and: filter}, {})
                    .sort({'dateStart': 1})
                    .then(data => {
                        if (data.length == 0) {
                            console.log(`groupLessonEvent did not exist`);
                            CalendarController.createNewGroupLessonEvent(groupLesson._id, day.toDate(), groupLesson.duration, groupLesson.group);
                        } else {
                            console.log(`groupLessonEvent already exist`);
                        }
                    });
            }
        }
    }

    /**
     * create a new groupLessonEvent
     * @param {string} origin
     * @param {Date} date
     * @param {number} duration
     * @param {string} group
     */
    private static createNewGroupLessonEvent(origin: string, date: Date, duration: number, group: string) {
        let endDateTime: Date = moment(date).clone().add(duration, 'h').toDate();
        console.log(`create new event from ${date} to ${endDateTime}`)
        let event = new Event({
            public: true,
            origin: origin,
            type: 'lesson',
            eventName: 'Gruppenstunde',
            dateStart: date,
            dateEnd: endDateTime,
            description: null,
            competent: null,
            groups: [group],
            address: null,
        });

        event.validate(async err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);

            event.save();
        });
    }
}
