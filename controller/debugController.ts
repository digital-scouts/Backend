import {ErrorREST, Errors} from "../errors";
import {User} from "../models/userModel";
import {Group} from "../models/groupModel";
import {GroupLesson} from "../models/groupLessonModel";
import {Address} from "../models/addressModel";
import {Chat} from "../models/chatModel";
import {Event} from "../models/eventModel";
import {Document} from "../models/documentModel";
import {TextMessage} from "../models/messageModel";
import {Notification} from "../models/notificationModel";

export class DebugController {

    public static initData(request, response, next) {
        let res = [];

        //Wöe leader + group
        let user = new User({
            name_first: 'Jacob',
            name_last: 'Inzelmann',
            email: 'inzelmann@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(data => {
            res.push(data);
            let group = new Group({
                name: 'Wölflinge',
                color: 'orange',
                leader: data._id
            });
            group.save().then(data => {
                let user = new User({
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

                user = new User({
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
        user = new User({
            name_first: 'Sonja',
            name_last: 'Schöpff',
            email: 'schoepff@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(data => {
            res.push(data);
            let group = new Group({
                name: 'Jungpfadfinder',
                color: 'blue',
                leader: data._id
            });
            group.save().then(data => {
                let user = new User({
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

                user = new User({
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
        user = new User({
            name_first: 'Karolin',
            name_last: 'Ferner',
            email: 'ferner@mail.de',
            password: '1234Ee!!!!',
            role: 'leader',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(data => {
            res.push(data);
            let group = new Group({
                name: 'Pfadfinder',
                color: 'green',
                leader: data._id
            });
            group.save().then(data => {
                let user = new User({
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

                user = new User({
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
        let group = new Group({
            name: 'Rover',
            color: 'red',
        });
        group.save().then(data => {
            let user = new User({
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

            user = new User({
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
        user = new User({
            name_first: 'Janneck',
            name_last: 'Lange',
            email: 'lange@mail.de',
            password: '1234Ee!!!!',
            role: 'admin',
            accountStatus: {
                activated: true
            }
        });
        user.save().then(data => res.push(data));

        response.status(200).json(res);
    }

    public static deleteDB(request, response, next) {
        let res = [];

        User.deleteMany().then(data => res.push(data));
        Group.deleteMany().then(data => res.push(data));
        GroupLesson.deleteMany().then(data => res.push(data));
        Address.deleteMany().then(data => res.push(data));
        Chat.deleteMany().then(data => res.push(data));
        Event.deleteMany().then(data => res.push(data));
        Document.deleteMany().then(data => res.push(data));
        TextMessage.deleteMany().then(data => res.push(data));
        Notification.deleteMany().then(data => res.push(data));

        response.status(200).json(res);
    }
}
