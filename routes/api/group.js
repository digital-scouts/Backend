var express_1 = require("express");
var token_1 = require("../token");
var permission_1 = require("../permission");
var groupController_1 = require("../../controller/groupController");
var Group = (function () {
    function Group() {
        this.router = express_1.Router();
        this.init();
    }
    Group.prototype.init = function () {
        this.router.route('/')
            .get(token_1.verifyToken, permission_1.checkPermission, groupController_1.GroupController.getGroups)
            .post(token_1.verifyToken, permission_1.checkPermission, groupController_1.GroupController.newGroup)
            .put(token_1.verifyToken, permission_1.checkPermission, groupController_1.GroupController.updateGroup)
            .delete(token_1.verifyToken, permission_1.checkPermission, groupController_1.GroupController.deleteGroups);
        this.router.route('/:id')
            .delete(token_1.verifyToken, permission_1.checkPermission, groupController_1.GroupController.deleteGroup);
    };
    return Group;
})();
var groupRouter = new Group();
groupRouter.init();
exports.default = groupRouter.router;
//# sourceMappingURL=group.js.map