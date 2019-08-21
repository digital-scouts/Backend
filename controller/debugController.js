var userModel_1 = require("../models/userModel");
var groupModel_1 = require("../models/groupModel");
var groupLessonModel_1 = require("../models/groupLessonModel");
var addressModel_1 = require("../models/addressModel");
var chatModel_1 = require("../models/chatModel");
var eventModel_1 = require("../models/eventModel");
var documentModel_1 = require("../models/documentModel");
var messageModel_1 = require("../models/messageModel");
var notificationModel_1 = require("../models/notificationModel");
var DebugController = (function () {
    function DebugController() {
    }
    DebugController.initData = function (request, response, next) {
        var res = [];
        //Wöe leader + group
        var user = new userModel_1.User({
            name_first: 'Jacob',
            name_last: 'Inzelmann',
            email: 'inzelmann@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Wölflinge',
                color: 'orange',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Kasper',
                    name_last: 'Stand',
                    email: 'woe1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Kazimir',
                    name_last: 'Stand',
                    email: 'woe2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //jufi leader + group
        user = new userModel_1.User({
            name_first: 'Sonja',
            name_last: 'Schöpff',
            email: 'schoepff@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Jungpfadfinder',
                color: 'blue',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Lena',
                    name_last: 'Calmer',
                    email: 'jufi1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Jona',
                    name_last: 'Elze',
                    email: 'jufi2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //pfadi leader+ group
        user = new userModel_1.User({
            name_first: 'Karolin',
            name_last: 'Ferner',
            email: 'ferner@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) {
            res.push(data);
            var group = new groupModel_1.Group({
                name: 'Pfadfinder',
                color: 'green',
                leader: data._id
            });
            group.save().then(function (data) {
                var user = new userModel_1.User({
                    name_first: 'Paula',
                    name_last: 'Calmer',
                    email: 'pfadi1@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
                user = new userModel_1.User({
                    name_first: 'Ronja',
                    name_last: 'Räubertochter',
                    email: 'pfadi2@mail.de',
                    password: '1234Ee!!!!',
                    role: 'member',
                    group: data._id,
                    accountStatus: {
                        activated: true
                    }
                });
                user.save();
            });
        });
        //rover group
        var group = new groupModel_1.Group({
            name: 'Rover',
            color: 'red',
        });
        group.save().then(function (data) {
            var user = new userModel_1.User({
                name_first: 'Svantje',
                name_last: 'Grohn',
                email: 'rover1@mail.de',
                password: '1234Ee!!!!',
                role: 'member',
                group: data._id,
                accountStatus: {
                    activated: true
                }
            });
            user.save();
            user = new userModel_1.User({
                name_first: 'Nele',
                name_last: 'Grohn',
                email: 'rover2@mail.de',
                password: '1234Ee!!!!',
                role: 'member',
                group: data._id,
                accountStatus: {
                    activated: true
                }
            });
            user.save();
        });
        //admin
        user = new userModel_1.User({
            name_first: 'Janneck',
            name_last: 'Lange',
            email: 'lange@mail.de',
            password: '1234Ee!!!!',
            role: 'admin',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(function (data) { return res.push(data); });
        response.status(200).json(res);
    };
    DebugController.deleteDB = function (request, response, next) {
        var res = [];
        userModel_1.User.deleteMany().then(function (data) { return res.push(data); });
        groupModel_1.Group.deleteMany().then(function (data) { return res.push(data); });
        groupLessonModel_1.GroupLesson.deleteMany().then(function (data) { return res.push(data); });
        addressModel_1.Address.deleteMany().then(function (data) { return res.push(data); });
        chatModel_1.Chat.deleteMany().then(function (data) { return res.push(data); });
        eventModel_1.Event.deleteMany().then(function (data) { return res.push(data); });
        documentModel_1.Document.deleteMany().then(function (data) { return res.push(data); });
        messageModel_1.TextMessage.deleteMany().then(function (data) { return res.push(data); });
        notificationModel_1.Notification.deleteMany().then(function (data) { return res.push(data); });
        response.status(200).json(res);
    };
    return DebugController;
})();
exports.DebugController = DebugController;
//# sourceMappingURL=debugController.js.map