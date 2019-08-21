var userModel_1 = require("../models/userModel");
var nodemailer = require('nodemailer');
// const ical = require('ical-generator');
var fs = require('fs'); // read html file
var handlebars = require('handlebars'); // compile html for email with replacements
var config_1 = require("./../config");
var namiController_1 = require("./namiController");
// const cal = ical({domain: 'github.com', name: 'my first iCal'});
(function (EmailSource) {
    EmailSource[EmailSource["OwnDB"] = 0] = "OwnDB";
    EmailSource[EmailSource["NamiMember"] = 1] = "NamiMember";
    EmailSource[EmailSource["NamiVertretungsberechtigter"] = 2] = "NamiVertretungsberechtigter";
    EmailSource[EmailSource["NamiSonstige"] = 3] = "NamiSonstige";
})(exports.EmailSource || (exports.EmailSource = {}));
var EmailSource = exports.EmailSource;
var MailController = (function () {
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
        MailController.getEmailsByGroup(groups).then(async, function (mails) {
            var reg = /<img alt="calendar_img-([1-31]+)-([1-12]+)" src="">/g;
            mails = [{
                    childName: 'Janneck',
                    familyName: 'Lange',
                    emailSource: EmailSource.OwnDB,
                    email: 'langejanneck@gmail.com'
                }]; //todo remove after debug
            var sendThis = [];
            var emailSendStatus = [];
            for (var i = 0; i < mails.length; i++) {
                var content = request.body.text
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
                sendThis.push(emailSendStatus.push({
                    email: mails[i].email,
                    status: await, MailController: .sendMail(mails[i], request.body.subject, request.decoded.email, content)
                }));
            }
            await;
            Promise.all(sendThis);
            response.status(200).json(emailSendStatus);
        });
    };
    /**
     * return promise<string[]> with all emails for the requested groups (saved in own DB)
     * @param groups
     */
    MailController.getEmailsByGroup = function (groups) {
        var mails = [];
        return new Promise(async(resolve, reject), {
            //when groups is not a array.
            try: {
                groups: .forEach(function (x) { return x; })
            }, catch: function (e) {
                groups = [groups];
            },
            for: function (let) { }, i: function () { }, i: ++ });
        {
            var namiEmailsFilter = null;
            //get name from group for nami filter
            var group = await, Group_1, findById = (groups[i]);
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
            //load mails from nami and DB
            var namiEmails = await[0], Promise, all = ([
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
            ]);
            mails = mails.concat(namiEmails);
        }
        resolve(mails);
    };
    ;
    MailController.readonly = senderAddress = {
        name: config_1.Config.mail.user_name,
        address: config_1.Config.mail.user
    };
    MailController.readonly = transporter = nodemailer.createTransport({
        service: config_1.Config.mail.service,
        auth: {
            user: config_1.Config.mail.user,
            pass: config_1.Config.mail.pass
        }
    });
    return MailController;
})();
exports.MailController = MailController;
readHTMLFile(path, callback);
{
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
        }
        else {
            callback(null, html);
        }
    });
}
;
async;
drawCalendar(day, month, width, imgPath);
{
    var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
    var canvas = createCanvas(width, width);
    var ctx = canvas.getContext('2d');
    var image = await, loadImage = (imgPath);
    ctx.drawImage(image, 0, 0, width, width);
    //Day
    ctx.font = 0.5 * width + 'px Impact';
    var text_with = ctx.measureText(day);
    ctx.fillText(day, (width / 2) - (text_with.width / 2), (width / 2) + (text_with.emHeightAscent / 2));
    //Month
    ctx.font = 0.15 * width + 'px Impact';
    text_with = ctx.measureText(month);
    ctx.fillText(month, (width / 2) - (text_with.width / 2), 0.2 * width);
    return canvas.toDataURL();
}
//# sourceMappingURL=mailController.js.map