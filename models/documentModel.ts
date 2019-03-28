import {Schema, Model, model} from "mongoose";

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const document: Schema = new Schema({
        link: { // link to element when clicking the action button
            type: String,
        },
        name: { // Name of the Document or title of the Website
            type: String,
        },
        action: { // Title of the Button like 'Annmelden' or 'Download'
            type: String,
        },
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


export const Document: Model = model("Document", document);
