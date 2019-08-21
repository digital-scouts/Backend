var express_1 = require("express");
var mailController_1 = require("../../controller/mailController");
var Mail = (function () {
    function Mail() {
        this.router = express_1.Router();
        this.init();
    }
    Mail.prototype.init = function () {
        this.router.route('/')
            .post(mailController_1.MailController.send);
    };
    return Mail;
})();
var mailRouter = new Mail();
mailRouter.init();
exports.default = mailRouter.router;
//# sourceMappingURL=mail.js.map