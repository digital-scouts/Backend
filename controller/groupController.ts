import {ErrorREST, Errors} from "../errors";
import {Group} from "../models/groupModel";
import {GroupLesson} from "../models/groupLessonModel";
import {_helper as Helper} from "./_helper";

export class GroupController {

    /**
     * send all groups unfiltered
     * @param request
     * @param response
     * @param next
     */
    static getGroups(request, response, next) {
        Group.find().then(data => response.json(data)).catch(next);
    }

    /**
     * send the new group
     * @param request
     * @param response
     * @param next
     */
    static newGroup(request, response, next) {
        Helper.getActiveLeadersByArray(request.body.leader).then((leaders) => {
            let group = new Group({
                name: request.body.name,
                leader: leaders,
                logo:request.body.logo
            });

            group.validate(async err => {
                if (err)
                    for (let errName in err.errors)
                        if (err.errors[errName].name === 'ValidatorError') {
                            console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                            return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                        }

                await group.save().then(event => response.status(200).json(event)).catch(next);
            });
        });
    }

    /**
     * delete all groups
     * @param request
     * @param response
     * @param next
     */
    static deleteGroups(request, response, next) {
        Group.deleteMany().then(data => response.json(data)).catch(next);
    }

    /**
     * todo
     * @param request
     * @param response
     * @param next
     */
    static updateGroup(request, response, next) {
        return next(new ErrorREST(Errors.NoContent));
    }

    /**
     * send all groupLessons unfiltered
     * @param request
     * @param response
     * @param next
     */
    static getGroupLessons(request, response, next) {
        GroupLesson.find().then(data => response.json(data)).catch(next);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static newGroupLesson(request, response, next) {

        if(Helper.isGroupValid(request.body.group)){
            let group = new Group({
                group: request.body.group,
                frequency: request.body.frequency,
                startDate: request.body.startDate,
                end: (request.body.end == undefined)? null:request.body.end,
                duration: request.body.duration,
            });

            group.validate(async err => {
                if (err)
                    for (let errName in err.errors)
                        if (err.errors[errName].name === 'ValidatorError') {
                            console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                            return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                        }

                await group.save().then(event => response.status(200).json(event)).catch(next);
            });
        }else{
            return next(new ErrorREST(Errors.UnprocessableEntity, "The group is not valid."));
        }
    }

    /**
     * todo
     * @param request
     * @param response
     * @param next
     */
    static changeGroupLesson(request, response, next) {
        return next(new ErrorREST(Errors.NoContent));
    }

    /* PRIVATE START */





}
