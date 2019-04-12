import {Schema, Model, model} from "mongoose";

// save often used addresses and addresses for events.
// did not save addresses from members
const address: Schema = new Schema({
        name: { // name of the Address like 'Gruppenraum' or 'St. Gabriel'
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
        otherAddressInfo: { // like 'crossing xy', 'second floor' or 'bus stop xy'
            type: String
        }
    }, {
        timestamps: true
    },
    {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 1000
        }
    }
);


export const Address: Model = model("Address", address);
