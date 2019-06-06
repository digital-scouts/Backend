import {ErrorREST, Errors} from "../errors";
import {Group} from "../models/groupModel";
import {GroupLesson} from "../models/groupLessonModel";
import {_helper, _helper as Helper} from "./_helper";

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
                logo: request.body.logo,
                creator: request.decoded.userID,
                color: request.body.color,
                defaultForRole: request.body.defaultForRole,
                childGroup: request.body.childGroup
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
     * delete all groups and all GroupLessons
     * @param request
     * @param response
     * @param next
     */
    static deleteGroups(request, response, next) {
        Group.deleteMany().then(groupData => {
            GroupLesson.deleteMany().then(lessonData => response.json({
                groups: groupData,
                groupLessons: lessonData
            })).catch(next)
        }).catch(next);
    }

    /**
     * delete a specific group and all related groupLessons
     * @param request
     * @param response
     * @param next
     */
    static deleteGroup(request, response, next) {
        Group.remove({_id: request.params.id}).then(groupData => {
            if (groupData.n > 0) {
                GroupLesson.deleteMany({group: request.params.id}).then(lessonData => response.json({
                    groups: groupData,
                    groupLessons: lessonData
                })).catch(next);
            }
        }).catch(next);
    }

    /**
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
                if (request.body.color != undefined && request.body.color != group.color) {
                    group.color = request.body.color;
                    anyChanges = true;
                }
                if (request.body.defaultForRole != undefined && request.body.defaultForRole != group.defaultForRole) {
                    //todo check if group exist in config
                    group.defaultForRole = request.body.defaultForRole;
                    anyChanges = true;
                }
                if (request.body.childGroup != undefined && request.body.childGroup != group.childGroup) {
                    group.childGroup = request.body.childGroup;
                    anyChanges = true;
                }

                if (anyChanges) {
                    group.lastEdit = request.decoded.userID;
                    group.save().then(group => response.status(200).json(group)).catch(next);
                } else {
                    response.status(200).json("No Changes")
                }

            } else {
                return next(new ErrorREST(Errors.UnprocessableEntity, "The group could not be found"));
            }
        });
    }
}
