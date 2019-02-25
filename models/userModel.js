const config = require('../config').Config.user;

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//return string array with all rolenames set in config file
let roleNames = config.map(function (item) {
    return item['roleName'];
});

const user = new Schema({
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
        password: {
            type: String,
            required: [true, 'Password is required (password)'],
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/, 'Please choose a saver password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&.-_).']
        },
        address: {
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
        role: {
            type: String,
            enum: roleNames,//load roles from config
            required: [true, 'Role is required (role) ('+roleNames+')']
        },
        accountStatus: {
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

module.exports = {
    user: mongoose.model('user', user)
};
