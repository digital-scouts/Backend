//https://stackoverflow.com/questions/24286835/express-js-mongoose-user-roles-and-permissions

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ObjectID = Schema.Types.ObjectId;

const user = new Schema({
    name_first: {
        type: String,
        required: [true,"First Name is required (name_first)"]
    },
    name_last: {
        type: String,
        required: [true,"Last Name is required (name_last)"]
    },
    image_profile: {
        type: String,
        default: '/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAQQBBAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+uKKKKAA0UAEnAGTXYaH8MNU1aFZp2SwjbkCUEuR67f8aAOOorutU+EmpWcRktLiK9KjOwAox+mcj9a4iaF7eVopUaORDhkYYIP0oAZQKBRigAzRS5ooAKKSigDv/hT4aj1K8m1G4QPHbELGrDgv6/h/WvXMYrhfg/MjeHbiMffS4Jb8VXH8q7qgBMV538VvDMcun/2vCoWeIhZcD7yngE+4OK9ErnfiFMkHg/US5+8gUA9ySKAPB6MUUUAHFFGKKAFpKKmtLSa/uY7eCMyTSNtVF7mgDf8AAvir/hGNTJmybOcBZQO3o34V7faXcV9Ak0DiSJxuVweCK5Lwn8ObLRokmvES7vsZJcZRD6KP612YUKMAYHpQAO4RSWIAHJJ7V498SPGUetSrYWT77SJtzyDpIw6Y9hXsVcz4n8C6f4giZjGttefwzxjBz/tDvQB4XRVzV9IudD1CS0uk2Sp37MOxHtVOgAoozRQAlepfCbw4qWsmryqDJITHDnso+8fxPH4V5bX0R4bsxp+g2FuoxshUH645/XNAGkBiloxRQAUYooxQBxfxN8OLqmiPeIv+k2gLgjqU/iH9fwrxivpe4iWeF42GVcFSD6Gvm+9tzaXk8B/5ZSMnPscUAQ0UnNFAB3r6UtP+PaH/AHF/lRRQBNSj+tFFAB2/CloooAY/RfrXztr/APyHdS/6+ZP/AEI0UUAUKKKKAP/Z'
    },
    email : {
        type: String,
        required: [true, "Email is required (email)"],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required (password)"],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,"Please choose a saver password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&.-_)."]
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
        street_nr: {
            type: String,
            required: false
        }
    },
    role: {
        type: [{
            type: String,
            enum: ['demoUser', 'woe', 'jufi', 'pfadi', 'rover', 'leader', 'admin', 'parent']
        }],
        default: ['demoUser']
    },
},{
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
    user: mongoose.model('user', user),
};
