var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = mongoose_1.Schema.ObjectId;
var document = new mongoose_1.Schema({
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