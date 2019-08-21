var express_1 = require("express");
var debugController_1 = require("../../controller/debugController");
var Debug = (function () {
    function Debug() {
        this.router = express_1.Router();
        this.init();
    }
    Debug.prototype.init = function () {
        this.router.route('/')
            .post(debugController_1.DebugController.initData)
            .delete(debugController_1.DebugController.deleteDB);
    };
    return Debug;
})();
var debugRouter = new Debug();
debugRouter.init();
exports.default = debugRouter.router;
//# sourceMappingURL=debug.js.map