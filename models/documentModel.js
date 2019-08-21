"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var document = new Schema({
    link: {
        type: String,
    },
    name: {
        type: String,
    },
    action: {
        type: String,
    },
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Document = mongoose_1.model("Document", document);
//# sourceMappingURL=documentModel.js.map