import {ErrorREST, Errors} from "../errors";
import {Group} from "../models/groupModel";
import {GroupLesson} from "../models/groupLessonModel";
import {_helper, _helper as Helper} from "./_helper";
import {Event} from "../models/eventModel";

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
                logo: request.body.logo
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
        let anyChanges = false;
        Group.findById(request.body.id, function (err, group) {
            if (group) {
                if (request.body.name != undefined && request.body.name != group.name) {
                    group.name = request.body.name;
                    anyChanges = true;
                }
                if (request.body.leader != undefined && request.body.leader != group.leader) {
                    group.leader = _helper.getActiveLeadersByArray(request.body.leader);
                    anyChanges = true;
                }
                if (request.body.logo != undefined && request.body.logo != group.logo) {
                    group.logo = request.body.logo;
                    anyChanges = true;
                }

                if (anyChanges) {
                    group.lastEdit = request.decoded.userID;
                    group.save().then(group => response.status(200).json(group)).catch(next);
                }else{
                    response.status(200).json("No Changes")
                }

            } else {
                return next(new ErrorREST(Errors.UnprocessableEntity, "The group could not be found"));
            }
        });
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

        if (Helper.isGroupValid(request.body.group)) {
            let group = new Group({
                group: request.body.group,
                frequency: request.body.frequency,
                startDate: request.body.startDate,
                end: (request.body.end == undefined) ? null : request.body.end,
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
        } else {
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
