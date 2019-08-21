var express_1 = require("express");
var namiController_1 = require("../../controller/namiController");
/**
 * todo remove this route
 */
var Nami = (function () {
    function Nami() {
        this.router = express_1.Router();
        this.init();
    }
    Nami.prototype.init = function () {
        this.router.route('/member')
            .get(namiController_1.NamiAPI.getAllMemberForGroup);
        this.router.route('/member/:id')
            .get(namiController_1.NamiAPI.getOneMemberFromGroupById);
        this.router.route('/email')
            .get(namiController_1.NamiAPI.getEmailsByFilter);
    };
    return Nami;
})();
var namiRouter = new Nami();
namiRouter.init();
exports.default = namiRouter.router;
//# sourceMappingURL=nami.js.map