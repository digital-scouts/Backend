import {Schema, Model, model} from "mongoose";
import {Config} from "../config";

const ObjectId = Schema.ObjectId;

//return string array with all roleNames set in config file
let roleNames = Config.user.map(function (item) {
    return item['roleName'];
});

const user: Schema = new Schema({
        name_first: {
            type: String,
            required: [true, 'First Name is required (name_first)']
        },
        name_last: {
            type: String,
            required: [true, 'Last Name is required (name_last)']
        },
        image_profile: {
            type: String,
            default: "Set this Later, with a random out of a selection",
            required: [true, "A profile Image is required, but normally it will be a default Image. So it must be a server error"]
        },
        email: {
            type: String,
            required: [true, 'Email is required, if you dont have a email, ask for your parents email (email)'],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address (example: name@mail.com)']
        },
        password: {//remove regex later, password will be hashed
            type: String,
            required: [true, 'Password is required (password)'],
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/, 'Please choose a saver password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&.-_).']
        },
        address: { // dont use addressModel
            plz: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            street: {
                type: String,
                required: false
            },
            nr: {
                type: String,
                required: false
            }
        },
        role: { // todo replace this with object
            type: String,
            enum: roleNames,//load roles from config
            required: [true, 'Role is required (role) (' + roleNames + ')']
        },
        accountStatus: {
            namiLink: {
                type: String,
                default: null,
                require: true
            },
            activated: {
                type: Boolean,
                default: false,// a new account must be activated from a 'leader'
                required: true
            },
            disabled: {
                type: Boolean,
                default: false,// a account can be disabled or banned
                required: true
            },
            inactive: {
                type: Boolean,
                default: false,// a account can be inactive after a long time not using digital-scouts
                required: true
            }
        },
        socketID: {
            type: String,
            default: null,
            require: true
        },
    notifications:
        [{
            type: ObjectId,
            ref: 'Notification',
            require: false
    }]
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

export const User: Model = model("User", user);
