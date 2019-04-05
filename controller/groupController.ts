import {ErrorREST, Errors} from "../errors";
import {User} from "../models/userModel";
import {Group} from "../models/groupModel";
import {GroupLesson} from "../models/groupLessonModel";

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
        GroupController.validateLeader(request.body.leader).then((leaders) => {
            let group = new Group({
                name: request.body.name,
                leader: leaders,
                logo: GroupController.validateImage(request.body.logo)
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

        if(GroupController.validateGroup(request.body.group)){
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

    /**
     * validate the request leader, return id array with valid leaders
     * @param leaderIDs
     */
    private static validateLeader(leaderIDs: string[]) {
        let resultLeader = [];
        let i = 0;
        if (leaderIDs != undefined) {
            leaderIDs.forEach(id => {
                i++;
                User.findById(id).then(user => {
                    if (user) {
                        if (user.role == 'leader' && user.accountStatus.activated == true) {
                            resultLeader.push(user._id)
                        }
                    } else {
                        //user did not exist
                    }
                });
            });

            return new Promise(resolve => {
                function checkFlag() {
                    if (i == leaderIDs.length) {
                        resolve(resultLeader);
                    } else {
                        setTimeout(checkFlag, 100);
                    }
                }

                checkFlag();
            });
        } else {
            return Promise.resolve(null);
        }

    }

    /**
     * check if the image exist
     * todo
     * @param logo
     */
    private static validateImage(logo: string): string {

        return "Not Implemented yet";
    }

    /**
     * check if the group exist
     * @param group
     */
    private static validateGroup(group:string):boolean{
        return GroupLesson.findById(group).then(group=>{
           return !!group;
        });
    }
}
