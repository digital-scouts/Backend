var errors_1 = require("../errors");
var groupModel_1 = require("../models/groupModel");
var groupLessonModel_1 = require("../models/groupLessonModel");
var _helper_1 = require("./_helper");
var GroupController = (function () {
    function GroupController() {
    }
    /**
     * send all groups unfiltered
     * @param request
     * @param response
     * @param next
     */
    GroupController.getGroups = function (request, response, next) {
        groupModel_1.Group.find().then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * send the new group
     * @param request
     * @param response
     * @param next
     */
    GroupController.newGroup = function (request, response, next) {
        _helper_1._helper.getActiveLeadersByArray(request.body.leader).then(function (leaders) {
            var group = new groupModel_1.Group({
                name: request.body.name,
                leader: leaders,
                logo: request.body.logo,
                creator: request.decoded.userID,
                color: request.body.color,
            });
            group.validate(async, function (err) {
                if (err)
                    for (var errName in err.errors)
                        if (err.errors[errName].name === 'ValidatorError') {
                            console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                            return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
                        }
                await;
                group.save().then(function (event) { return response.status(200).json(event); }).catch(next);
            });
        });
    };
    /**
     * delete all groups and all GroupLessons
     * @param request
     * @param response
     * @param next
     */
    GroupController.deleteGroups = function (request, response, next) {
        groupModel_1.Group.deleteMany().then(function (groupData) {
            groupLessonModel_1.GroupLesson.deleteMany().then(function (lessonData) { return response.json({
                groups: groupData,
                groupLessons: lessonData
            }); }).catch(next);
        }).catch(next);
    };
    /**
     * delete a specific group and all related groupLessons
     * @param request
     * @param response
     * @param next
     */
    GroupController.deleteGroup = function (request, response, next) {
        groupModel_1.Group.remove({ _id: request.params.id }).then(function (groupData) {
            if (groupData.n > 0) {
                groupLessonModel_1.GroupLesson.deleteMany({ group: request.params.id }).then(function (lessonData) { return response.json({
                    groups: groupData,
                    groupLessons: lessonData
                }); }).catch(next);
            }
        }).catch(next);
    };
    /**
     * @param request
     * @param response
     * @param next
     */
    GroupController.updateGroup = function (request, response, next) {
        var anyChanges = false;
        groupModel_1.Group.findById(request.body.id, function (err, group) {
            if (group) {
                if (request.body.name != undefined && request.body.name != group.name) {
                    group.name = request.body.name;
                    anyChanges = true;
                }
                if (request.body.leader != undefined && request.body.leader != group.leader) {
                    group.leader = _helper_1._helper.getActiveLeadersByArray(request.body.leader);
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
                    group.save().then(function (group) { return response.status(200).json(group); }).catch(next);
                }
                else {
                    response.status(200).json("No Changes");
                }
            }
            else {
                return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, "The group could not be found"));
            }
        });
    };
    return GroupController;
})();
exports.GroupController = GroupController;
//# sourceMappingURL=groupController.js.map