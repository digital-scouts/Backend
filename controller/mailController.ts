import {ErrorREST, Errors} from "../errors";
import * as nodemailer from 'nodemailer';

const ical = require('ical-generator');
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import {Config} from "./../config";
import * as moment from 'moment';

const cal = ical({domain: 'github.com', name: 'my first iCal'});

export class MailController {

    private static readonly senderAddress = {
        name: Config.mail.user_name,
        address: Config.mail.user
    };

    private static readonly transporter = nodemailer.createTransport({
        service: Config.mail.service,
        auth: {
            user: Config.mail.user,
            pass: Config.mail.pass
        }
    });

    constructor() {
    }

    public static send(request, response, next) {

        const receiver = request.body.receiver_mail;
        const greeding = request.body.greeding;
        const subject = request.body.subject;
        const replyTo = request.body.replyTo;
        const content = request.body.text
            .replace(/(?:\r\n|\r|\n)/g, '<br>')
            .replace('{{greeding}}', greeding);

        const eventPath = __dirname + '/MailSrc/events/invitation.ics';
        cal.createEvent({
            start: moment(),
            end: moment().add(1, 'hour'),
            summary: 'Example Event',
            description: 'It works ;)',
            location: 'my room',
            url: 'http://sebbo.net/'
        });
        cal.saveSync(eventPath);

        MailController.readHTMLFile(__dirname + '/MailSrc/src/default.html', function (err, html) {
            const replacements = {
                betreff: subject,
                mail: receiver,
                text: content
            };

            const attachments = [{
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

            // @ts-ignore
            attachments.push({
                path: eventPath
            });

            let mailOptions = {
                from: MailController.senderAddress,
                bcc: receiver,
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
                    console.log(error);
                    return next(new ErrorREST(Errors.ServiceUnavailable, error));
                } else {
                    console.log('Email sent: ' + info.response);
                    response.status(200).json(info.response)
                }
            });
        });
    }

    private static readHTMLFile(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
            } else {
                callback(null, html);
            }
        });
    };
}
