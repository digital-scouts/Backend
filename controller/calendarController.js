"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var config = require("../config");
var eventModel_1 = require("../models/eventModel");
var _helper_1 = require("./_helper");
var groupLessonModel_1 = require("../models/groupLessonModel");
var moment = require("moment");
var holidayController_1 = require("./holidayController");
var CalendarController = /** @class */ (function () {
    function CalendarController() {
    }
    CalendarController.getAllEventsDebug = function (request, response, next) {
        eventModel_1.Event.find()
            .sort({ 'dateStart': 1 })
            .populate('groups')
            .then(function (data) {
            var rData = {};
            data.forEach(function (event) {
                var date = new Date(event.dateStart).toISOString().split('T')[0]; //ISO Date without time
                if (!rData.hasOwnProperty(date)) {
                    rData[date] = [];
                }
                rData[date].push(event);
            });
            response.json(rData);
        }).catch(next);
    };
    /**
     * list all existing events depends on filter in request body
     * sort and group by dateStart
     * @param request
     * @param response
     * @param next
     */
    CalendarController.getAllEvents = function (request, response, next) {
        var filterDateStart = request.query.dateStart;
        var filterDateEnd = request.query.dateEnd;
        var filterComplement = request.query.complement;
        var filterOrigin = request.query.origin;
        var filterGroup = request.query.group;
        var filterType = request.query.type;
        var today = new Date();
        var filter = [];
        if (filterDateStart != undefined && filterDateStart != 'null') {
            filter.push({ 'dateStart': { "$gte": filterDateStart } });
        }
        else {
            filter.push({ 'dateStart': { "$gte": today.setDate(today.getDate() - config.Config.calender.public_event_daysPast) } });
        }
        if (filterDateEnd != undefined && filterDateEnd != 'null') {
            filter.push({ 'dateEnd': { "$lt": filterDateEnd } });
        }
        else {
            filter.push({ 'dateEnd': { "$lt": today.setDate(today.getDate() + config.Config.calender.public_event_daysFuture) } });
        }
        if (filterComplement != null && filterComplement != 'null') {
            filter.push({ 'competent': { $in: filterComplement } });
        }
        if (filterOrigin != null && filterOrigin != 'null') {
            filter.push({ 'origin': filterOrigin });
        }
        if (filterType != null && filterType != 'null') {
            filter.push({ 'type': filterType });
        }
        if (filterGroup != null && filterGroup != 'null') {
            try {
                //try to use it like a array, when it fail use it as parameter and put it in array
                var l = filterGroup.length;
                filter.push({ 'groups': { $in: filterGroup } });
            }
            catch (ex) {
                filter.push({ 'groups': { $in: [filterGroup] } });
            }
        }
        else {
            if (request.decoded.role != 'admin')
                //if admin then show all events -> dont filter
                filter.push({ 'member': request.decoded.role });
        }
        eventModel_1.Event.find({ $and: filter }, {
            competent: 0, creator: 0, lastEdit: 0, public: 0, updatedAt: 0, createdAt: 0, attachments: 0, description: 0
        })
            .sort({ 'dateStart': 1 })
            .populate('groups')
            .then(function (data) {
            var rData = {};
            data.forEach(function (event) {
                var date = new Date(event.dateStart).toISOString().split('T')[0]; //ISO Date without time
                if (!rData.hasOwnProperty(date)) {
                    rData[date] = [];
                }
                rData[date].push(event);
            });
            response.json(rData);
        }).catch(next);
    };
    /**
     * show all events for public (only public events and without user names)
     * @param request
     * @param response
     * @param next
     */
    CalendarController.getAllPublicEvents = function (request, response, next) {
        var today = new Date();
        var filterStart = today.setDate(today.getDate() - config.Config.calender.public_event_daysPast);
        var filterEnd = today.setDate(today.getDate() + config.Config.calender.public_event_daysFuture);
        eventModel_1.Event.find({ 'public': true, 'dateEnd': { "$gte": filterStart, "$lt": filterEnd } }, {
            competent: 0,
            creator: 0,
            lastEdit: 0,
            public: 0
        }).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * CAUTION: This will delete one Event
     * @param request
     * @param response
     * @param next
     */
    CalendarController.deleteEvent = function (request, response, next) {
        eventModel_1.Event.remove({ _id: request.query.id }).then(function (event) { return response.json({ removedElements: event }); }).catch(next);
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    CalendarController.createNewEvent = function (request, response, next) {
        var _this = this;
        console.log('request.body.groups');
        console.log(request.body.groups);
        var startDateTime = new Date(request.body.startDate);
        var endDateTime = _helper_1._helper.checkEndDate(startDateTime, request.body.endDate);
        if (endDateTime == null) {
            return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
        }
        var userId = request.decoded.userID;
        var event = new eventModel_1.Event({
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
        event.validate(function (err) { return __awaiter(_this, void 0, void 0, function () {
            var errName, eventCollision;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err)
                            for (errName in err.errors)
                                if (err.errors[errName].name === 'ValidatorError') {
                                    console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                                    return [2 /*return*/, next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message))];
                                }
                        eventCollision = CalendarController.willEventCollide(event);
                        if (eventCollision.status) {
                            //todo do some magic and make a confirmation from client possible
                            //todo confirm and place element, cancel or move blocking element
                            console.log(eventCollision.message);
                            return [2 /*return*/, response.status().json(eventCollision.message)];
                        }
                        return [4 /*yield*/, event.save().then(function (event) { return response.status(200).json(event); }).catch(next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    CalendarController.updateEvent = function (request, response, next) {
        var anyChanges = false;
        eventModel_1.Event.findById(request.body.id, function (err, event) {
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
                    var startDateTime = new Date(request.body.startDate);
                    var endDateTime = _helper_1._helper.checkEndDate(startDateTime, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    }
                    else {
                        event.startDate = startDateTime;
                        event.endDate = endDateTime;
                        anyChanges = true;
                    }
                }
                else if (request.body.dateEnd != undefined && request.body.dateEnd != event.dateEnd) {
                    var endDateTime = _helper_1._helper.checkEndDate(event.startDate, request.body.endDate);
                    if (endDateTime == null) {
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The date for the end of the event must be after the start of the event"));
                    }
                    else {
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
                    return next(new errors_1.ErrorREST(errors_1.Errors.NoContent), "A part of the request cannot be resolved, the functionality is not implemented yet. Event did not changed.");
                }
                //todo change complement
                //todo change group
                //todo change attachments
                //todo change origin?
                if (anyChanges) {
                    event.lastEdit = request.decoded.userID;
                    event.save().then(function (event) { return response.status(200).json(event); }).catch(next);
                }
                else {
                    response.status(200).json("No Changes");
                }
            }
            else {
                return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The event could not be found"));
            }
        });
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    CalendarController.feedback = function (request, response, next) {
        console.log(request.decoded.userID);
        eventModel_1.Event.findById(request.query.eventId, function (err, event) {
            if (event) {
                if (event.feedback == null) {
                    event.feedback = [];
                }
                var index = event.feedback.findIndex(function (f) { return f.user == request.decoded.userID; });
                if (index > -1) {
                    event.feedback.splice(index, 1);
                }
                event.feedback.push({ user: request.decoded.userID, answer: request.query.answer });
                event.save().then(function (event) { return response.status(200).json(event); }).catch(next);
            }
        });
    };
    /**
     * todo check if the new event collide with an existing event
     * @param event
     */
    CalendarController.willEventCollide = function (event) {
        var status = false;
        var message = "Not Checked";
        var message_groupLesson = "The Event collide with a group lesson.";
        var message_holiday = "Your selected event is during the holidays.";
        var message_groupEvent = "The Event collide with an other event for this group.";
        var message_event = "The Event collide with an other event";
        var message_competent = "The competent for this event is not available";
        return { status: status, message: message };
    };
    /*
    ****************************************** GROUP LESSON
     */
    /**
     * send all groupLessons unfiltered
     * @param request
     * @param response
     * @param next
     */
    CalendarController.getGroupLessons = function (request, response, next) {
        groupLessonModel_1.GroupLesson.find().populate('group').then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * create a new groupLesson
     * @param request
     * @param response
     * @param next
     */
    CalendarController.newGroupLesson = function (request, response, next) {
        _helper_1._helper.isGroupValid(request.body.group).then(function (isGroupValid) {
            if (isGroupValid) {
                var groupLesson_1 = new groupLessonModel_1.GroupLesson({
                    group: request.body.group,
                    frequency: request.body.frequency,
                    startDate: request.body.startDate,
                    // end: (request.body.end == undefined) ? null : request.body.end,
                    duration: request.body.duration,
                    creator: request.decoded.userID
                });
                groupLesson_1.validate(function (err) {
                    if (err)
                        for (var errName in err.errors)
                            if (err.errors[errName].name === 'ValidatorError') {
                                console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                                return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
                            }
                    groupLesson_1.save().then(function (groupLesson) {
                        CalendarController.createNewGroupLessonEvents(groupLesson);
                        response.status(200).json(groupLesson);
                    });
                });
            }
            else {
                return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The group is not valid."));
            }
        });
    };
    /**
     * set end of groupLessons and remove all following groupLesson events
     * todo validate end
     * todo remove all following groupLesson events
     * @param request
     * @param response
     * @param next
     */
    CalendarController.finishGroupLessonPeriode = function (request, response, next) {
        groupLessonModel_1.GroupLesson.findById(request.body.id, function (err, lesson) {
            if (lesson && request.body.end != undefined && request.body.end != lesson.end) {
                lesson.end = request.body.end;
                lesson.lastEdit = request.decoded.userID;
                lesson.save().then(function (lesson) { return response.status(200).json(lesson); }).then(function () {
                });
            }
            else {
                if (lesson) {
                    response.status(200).json("No Changes");
                }
                else {
                    return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The groupLesson could not be found"));
                }
            }
        });
    };
    /**
     * todo set groupLesson event to canceled
     * @param request
     * @param response
     * @param next
     */
    CalendarController.cancelGroupLessonEvent = function (request, response, next) {
    };
    /**
     *
     * Warning: only for debug - delete a specific groupLesson
     * @param request
     * @param response
     * @param next
     */
    CalendarController.deleteGroupLesson = function (request, response, next) {
        if (config.Config.DEBUG) {
            groupLessonModel_1.GroupLesson.remove({ _id: request.params.id }).then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            return next(new errors_1.ErrorREST(errors_1.Errors.BadRequest, "This is only for debug, Debug is disabled"));
        }
    };
    /**
     *
     * @param request
     * @param response
     * @param next
     * @return {any}
     */
    CalendarController.deleteAllGroupLessons = function (request, response, next) {
        console.log('delete all');
        if (config.Config.DEBUG) {
            groupLessonModel_1.GroupLesson.remove().then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            return next(new errors_1.ErrorREST(errors_1.Errors.BadRequest, "This is only for debug, Debug is disabled"));
        }
    };
    /**
     * create all missing groupLessonEvents for the next (maxGroupLessonsEvents * frequency) days
     * @param groupLesson
     * @param maxGroupLessonsEvents
     */
    CalendarController.createNewGroupLessonEvents = function (groupLesson, maxGroupLessonsEvents) {
        if (maxGroupLessonsEvents === void 0) { maxGroupLessonsEvents = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var groupLessonStartMoment, _loop_1, i, day;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        groupLessonStartMoment = moment(groupLesson.startDate);
                        groupLessonStartMoment = (moment() > groupLessonStartMoment) ? moment().day(groupLessonStartMoment.day()).hour(groupLessonStartMoment.hour()).minute(groupLessonStartMoment.minute()) : groupLessonStartMoment;
                        _loop_1 = function (i, day) {
                            var filter;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("check if this lesson is already in events for " + day.format('DD.MM HH:mm'));
                                        return [4 /*yield*/, holidayController_1.HolidayController.isDateHolidayOrVacation(moment(day).format('YYYY-MM-DD'))];
                                    case 1:
                                        if (!(_a.sent())) {
                                            filter = [];
                                            filter.push({ 'dateStart': { "$gte": day } });
                                            filter.push({ 'origin': groupLesson._id });
                                            eventModel_1.Event.find({ $and: filter }, {})
                                                .sort({ 'dateStart': 1 })
                                                .then(function (data) {
                                                if (data.length == 0) {
                                                    console.log("groupLessonEvent did not exist");
                                                    CalendarController.createNewGroupLessonEvent(groupLesson._id, day.toDate(), groupLesson.duration, groupLesson.group);
                                                }
                                                else {
                                                    console.log("groupLessonEvent already exist");
                                                }
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0, day = groupLessonStartMoment;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxGroupLessonsEvents)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i, day)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++, day = groupLessonStartMoment.clone().add(groupLesson.frequency * i, 'd');
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * create a new groupLessonEvent
     * @param {string} origin
     * @param {Date} date
     * @param {number} duration
     * @param {string} group
     */
    CalendarController.createNewGroupLessonEvent = function (origin, date, duration, group) {
        var _this = this;
        var endDateTime = moment(date).clone().add(duration, 'h').toDate();
        console.log("create new event from " + date + " to " + endDateTime);
        var event = new eventModel_1.Event({
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
        event.validate(function (err) { return __awaiter(_this, void 0, void 0, function () {
            var errName;
            return __generator(this, function (_a) {
                if (err)
                    for (errName in err.errors)
                        if (err.errors[errName].name === 'ValidatorError')
                            console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                event.save();
                return [2 /*return*/];
            });
        }); });
    };
    return CalendarController;
}());
exports.CalendarController = CalendarController;
//# sourceMappingURL=calendarController.js.map