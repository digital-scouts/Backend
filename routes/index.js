"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var token_1 = require("./token");
var Index = /** @class */ (function () {
    function Index() {
        this.router = express_1.Router();
        this.init();
    }
    Index.prototype.init = function () {
        this.router.route('/')
            .get(function (req, res, next) {
            res.status(200).json({
                status: 200,
                key: 147261234,
                message: "RESTful API works.",
            });
        })
            .post(token_1.verifyToken, function (req, res, next) {
            res.status(200).json({
                status: 200,
                message: "Token is correct.",
                userID: req.decoded.userID,
                email: req.decoded.email,
                role: req.decoded.role,
                userNameFirst: req.decoded.userNameFirst,
                userNameLast: req.decoded.userNameLast,
            });
        });
    };
    return Index;
}());
var indexRouter = new Index();
indexRouter.init();
exports.default = indexRouter.router;
//# sourceMappingURL=index.js.map