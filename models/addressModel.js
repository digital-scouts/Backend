"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// save often used addresses and addresses for events.
// did not save addresses from members
var address = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    plz: {
        type: String,
    },
    city: {
        type: String,
    },
    street: {
        type: String,
    },
    nr: {
        type: String,
    },
    otherAddressInfo: {
        type: String
    }
}, {
    timestamps: true
}, {
    writeConcern: {
        w: 1,
        j: true,
        wtimeout: 1000
    }
});
exports.Address = mongoose_1.model("Address", address);
//# sourceMappingURL=addressModel.js.map