"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var userModel_1 = require("../models/userModel");
var nodemailer = require("nodemailer");
// const ical = require('ical-generator');
var fs = require("fs"); // read html file
var handlebars = require("handlebars"); // compile html for email with replacements
var config_1 = require("./../config");
var namiController_1 = require("./namiController");
var groupModel_1 = require("../models/groupModel");
// const cal = ical({domain: 'github.com', name: 'my first iCal'});
var EmailSource;
(function (EmailSource) {
    EmailSource[EmailSource["OwnDB"] = 0] = "OwnDB";
    EmailSource[EmailSource["NamiMember"] = 1] = "NamiMember";
    EmailSource[EmailSource["NamiVertretungsberechtigter"] = 2] = "NamiVertretungsberechtigter";
    EmailSource[EmailSource["NamiSonstige"] = 3] = "NamiSonstige";
})(EmailSource = exports.EmailSource || (exports.EmailSource = {}));
var MailController = /** @class */ (function () {
    function MailController() {
    }
    MailController.sendMail = function (receiver, subject, replyTo, content, eventPath) {
        if (eventPath === void 0) { eventPath = null; }
        return new Promise(function (resolve, reject) {
            var greding;
            if (receiver.emailSource == EmailSource.NamiVertretungsberechtigter) {
                greding = "Sehr geehrter Herr " + receiver.familyName + ", sehr geehrte Frau " + receiver.familyName + ",";
            }
            else if (receiver.emailSource == EmailSource.NamiSonstige && (receiver.email.startsWith('Herr') || receiver.email.startsWith('Vater'))) {
                var name_1 = receiver.email.split('<')[0];
                greding = "Sehr geehrter Herr " + name_1.slice(name_1.lastIndexOf(' ') + 1, name_1.length) + ",";
            }
            else if (receiver.emailSource == EmailSource.NamiSonstige && receiver.email.startsWith('Frau') || receiver.email.startsWith('Mutter')) {
                var name_2 = receiver.email.split('<')[0];
                greding = "Sehr geehrte Frau " + name_2.slice(name_2.lastIndexOf(' ') + 1, name_2.length) + ",";
            }
            else if (receiver.emailSource == EmailSource.NamiMember || receiver.emailSource == EmailSource.OwnDB) {
                greding = "Hallo " + receiver.childName + ",";
            }
            MailController.readHTMLFile(__dirname + '/MailSrc/src/default.html', function (err, html) {
                var replacements = {
                    betreff: subject,
                    mail: receiver,
                    text: content,
                    greding: greding
                };
                var attachments = [{
                        filename: 'stammesabzeichen.png',
                        path: __dirname + '/MailSrc/img/stammesabzeichen.png',
                        cid: 'img_stammesabzeichen'
                    }, {
                        filename: 'web.png',
                        path: __dirname + '/MailSrc/img/web.png',
                        cid: 'web_img'
                    }, {
                        filename: 'instagram.png',
                        path: __dirname + '/MailSrc/img/instagram.png',
                        cid: 'ig_img'
                    }];
                // if (eventPath != null) {
                //     //@ts-ignore
                //     attachments.push({
                //         path: eventPath
                //     });
                // }
                var mailOptions = {
                    from: MailController.senderAddress,
                    to: receiver.email,
                    bcc: 'langejanneck@gmail.com',
                    html: handlebars.compile(html)(replacements)
                        //fix <br>
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>'),
                    subject: subject,
                    text: content,
                    replyTo: replyTo,
                    attachments: attachments
                };
                MailController.transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('Email to ' + receiver.email + ' failed');
                        console.log(error);
                        reject(error);
                    }
                    else {
                        console.log('Email sent to ' + receiver.email + ': ' + info.response);
                        resolve(info.response);
                    }
                });
            });
        });
    };
    /**
     * send mail to all emails found in own DB and Nami for all groups
     * return [{email, status}]
     * @param request
     * @param response
     * @param next
     */
    MailController.send = function (request, response, next) {
        var _this = this;
        //hint why did i need to do it this way?
        var groups = (request.body['groups[]']) ? request.body['groups[]'] : request.body.groups;
        // let eventPath: string = null;
        // if (request.body.event) {//todo events for calendar
        //     eventPath = __dirname + '/MailSrc/events/invitation.ics';
        //     cal.createEvent({
        //         start: null,
        //         end: null,
        //         summary: 'Example Event',
        //         description: 'It works ;)',
        //         location: 'my room',
        //         url: 'http://sebbo.net/'
        //     });
        //     cal.saveSync(eventPath);
        // }
        MailController.getEmailsByGroup(groups).then(function (mails) { return __awaiter(_this, void 0, void 0, function () {
            var reg, sendThis, emailSendStatus, i, content, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        reg = /<img alt="calendar_img-([1-31]+)-([1-12]+)" src="">/g;
                        mails = [{
                                childName: 'Janneck',
                                familyName: 'Lange',
                                emailSource: EmailSource.OwnDB,
                                email: 'langejanneck@gmail.com'
                            }]; //todo remove after debug
                        sendThis = [];
                        emailSendStatus = [];
                        i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(i < mails.length)) return [3 /*break*/, 4];
                        content = request.body.text
                            .replace(/(?:\r\n|\r|\n)/g, '<br>')
                            .replace(/&nbsp;/g, ' ') //no-line break space
                            .replace(/&auml/g, 'ä')
                            .replace(/&Auml;/g, 'Ä')
                            .replace(/&ouml;/g, 'ö')
                            .replace(/&Ouml;/g, 'Ö')
                            .replace(/&uuml;/g, 'ü')
                            .replace(/&Uuml;/g, 'Ü')
                            .replace(/&szlig;/g, 'ß')
                            .replace(/&euro;/g, '€')
                            .replace(/&sect;/g, '§')
                            .replace(reg, function (match) {
                            console.log(match);
                        });
                        _b = (_a = sendThis).push;
                        _d = (_c = emailSendStatus).push;
                        _e = {
                            email: mails[i].email
                        };
                        return [4 /*yield*/, MailController.sendMail(mails[i], request.body.subject, request.decoded.email, content)];
                    case 2:
                        _b.apply(_a, [_d.apply(_c, [(_e.status = _f.sent(),
                                    _e)])]);
                        _f.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, Promise.all(sendThis)];
                    case 5:
                        _f.sent();
                        response.status(200).json(emailSendStatus);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * return promise<string[]> with all emails for the requested groups (saved in own DB)
     * @param groups
     */
    MailController.getEmailsByGroup = function (groups) {
        var _this = this;
        var mails = [];
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var i, namiEmailsFilter, group, namiEmails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //when groups is not a array.
                        try {
                            groups.forEach(function (x) { return x; });
                        }
                        catch (e) {
                            groups = [groups];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < groups.length)) return [3 /*break*/, 5];
                        namiEmailsFilter = null;
                        return [4 /*yield*/, groupModel_1.Group.findById(groups[i])];
                    case 2:
                        group = _a.sent();
                        switch (group.name) {
                            case 'Wölflinge':
                                namiEmailsFilter = 'woelfling';
                                break;
                            case 'Jungpfadfinder':
                                namiEmailsFilter = 'jungpfadfinder';
                                break;
                            case 'Pfadfinder':
                                namiEmailsFilter = 'pfadfinder';
                                break;
                            case 'Rover':
                                namiEmailsFilter = 'rover';
                                break;
                        }
                        return [4 /*yield*/, Promise.all([
                                namiController_1.NamiAPI.getAllEmailsByFilter(namiEmailsFilter),
                                userModel_1.User.find({ 'group': groups[i] }).then(function (users) {
                                    for (var j = 0; j < users.length; j++) {
                                        mails.push({
                                            childName: users[j]['name_first'],
                                            familyName: users[j]['name_last'],
                                            emailSource: EmailSource.OwnDB,
                                            email: users[j]['name_first'] + " " + users[j]['name_last'] + " <" + users[j]['email'] + ">"
                                        });
                                    }
                                })
                            ])];
                    case 3:
                        namiEmails = (_a.sent())[0];
                        mails = mails.concat(namiEmails);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        resolve(mails);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MailController.readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
            }
            else {
                callback(null, html);
            }
        });
    };
    ;
    /**
     * Create a Calender Img with Month and Date as base64
     * @param day
     * @param month
     * @param width
     * @param imgPath
     * @return {Promise<string>}
     */
    MailController.drawCalendar = function (day, month, width, imgPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, createCanvas, loadImage, canvas, ctx, image, text_with;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
                        canvas = createCanvas(width, width);
                        ctx = canvas.getContext('2d');
                        return [4 /*yield*/, loadImage(imgPath)];
                    case 1:
                        image = _b.sent();
                        ctx.drawImage(image, 0, 0, width, width);
                        //Day
                        ctx.font = 0.5 * width + 'px Impact';
                        text_with = ctx.measureText(day);
                        ctx.fillText(day, (width / 2) - (text_with.width / 2), (width / 2) + (text_with.emHeightAscent / 2));
                        //Month
                        ctx.font = 0.15 * width + 'px Impact';
                        text_with = ctx.measureText(month);
                        ctx.fillText(month, (width / 2) - (text_with.width / 2), 0.2 * width);
                        return [2 /*return*/, canvas.toDataURL()];
                }
            });
        });
    };
    MailController.senderAddress = {
        name: config_1.Config.mail.user_name,
        address: config_1.Config.mail.user
    };
    MailController.transporter = nodemailer.createTransport({
        service: config_1.Config.mail.service,
        auth: {
            user: config_1.Config.mail.user,
            pass: config_1.Config.mail.pass
        }
    });
    return MailController;
}());
exports.MailController = MailController;
//# sourceMappingURL=mailController.js.map