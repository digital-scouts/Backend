"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var constGlobal_1 = require("../constGlobal");
var sections = constGlobal_1.ConstGlobal.app.sections;
/**
 * @author lange
 * @since 2019-03-11
 * @type {}
 */
var notification = new mongoose_1.Schema({
    priority: {
        type: Number,
        min: 0,
        max: 3,
        default: 1
    },
    title: {
        type: String
    },
    message: {
        type: String
    },
    category: {
        type: String,
        enum: sections,
        default: 'none'
    },
    meta: {},
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Notification = mongoose_1.model("Notification", notification);
//# sourceMappingURL=notificationModel.js.map