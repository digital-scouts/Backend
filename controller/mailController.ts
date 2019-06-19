import {ErrorREST, Errors} from "../errors";
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import {Config} from "./../config";

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
        const readHTMLFile = function (path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                } else {
                    callback(null, html);
                }
            });
        };

        readHTMLFile(__dirname + '/MailSrc/src/default.html', function(err, html) {
            const replacements = {
                betreff: request.body.subject,
                mail: request.body.to,
                text: request.body.text
            };
            const htmlToSend = handlebars.compile(html)(replacements);

            let mailOptions = {
                from: MailController.senderAddress,
                to: request.body.to,
                cc: request.body.cc,
                bcc: request.body.bcc,
                html: htmlToSend,
                subject: request.body.subject,
                text: request.body.text,
                replyTo: request.body.replyTo,
                icalEvent: {
                    filename: 'invitation.ics',
                    method: 'request',
                    href: 'https://calendar.google.com/event?action=TEMPLATE&tmeid=N3BybjJoNHRjazY1NTc5aG9vcnJ0NXNucTYgZHBzZy5zYW50YS5sdWNpYUBt&tmsrc=dpsg.santa.lucia%40gmail.com'
                },
                attachments: [{
                    filename: 'stammesabzeichen.png',
                    path: __dirname + '/MailSrc/img/stammesabzeichen.png',
                    cid: 'img_stammesabzeichen'
                },{
                    filename: 'dpsg-stamm-logo.png',
                    path: __dirname + '/MailSrc/img/dpsg-stamm-logo.png',
                    cid: 'dpsg-stamm-logo'
                },{
                    filename: 'web.png',
                    path: __dirname + '/MailSrc/img/web.png',
                    cid: 'web_img'
                },{
                    filename: 'instagram.png',
                    path: __dirname + '/MailSrc/img/instagram.png',
                    cid: 'ig_img'
                }]
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
}
