import {Errors, ErrorREST} from "../errors";
import * as config from '../config';

export class CalendarController {

    /**
     * list all existing events depends on filter in request body
     */
    static getAllEvents() {
        //todo filter by group / member
        //todo filter by timespan
        //todo filter by competent
        //todo filter by origin
        //todo filter by eventType
        //todo filter by visibility (public)
    }

    static getAllPublicEvents() {

    }

    /**
     *
     */
    static createNewEvent() {

    }

    /**
     * get All events relevant for userGroup by id
     */
    static getAllEventsForId() {

    }

    /**
     *
     */
    static updateEvent() {

    }
}
