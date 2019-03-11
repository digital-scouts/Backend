import {Schema, Model, model} from "mongoose";
import {ConstGlobal} from '../constGlobal';

let sections = ConstGlobal.app.sections;

/**
 * @author lange
 * @since 2019-03-11
 * @type {}
 */
const notification: Schema = new Schema({
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
    },
    {
        timestamps: true
    },
    {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 1000
        }
    });

export const Notification: Model = model("Notification", notification);