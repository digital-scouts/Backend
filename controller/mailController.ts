import {ErrorREST, Errors} from "../errors";
import {User} from "../models/userModel";
import * as nodemailer from 'nodemailer';

const ical = require('ical-generator');
import * as fs from 'fs'; // read html file
import * as handlebars from 'handlebars'; // compile html for email with replacements
import {Config} from "./../config";

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

    private static sendMail(receiver, subject, replyTo, content, eventPath = null) {
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

            if (eventPath != null) {
                //@ts-ignore
                attachments.push({
                    path: eventPath
                });
            }

            let mailOptions = {
                from: MailController.senderAddress,
                to: receiver + ',langejanneck@gmail.com',
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
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }

    public static send(request, response, next) {
        let eventPath: string = null;
        if (request.body.event) {//todo events for calendar
            eventPath = __dirname + '/MailSrc/events/invitation.ics';
            cal.createEvent({
                start: null,
                end: null,
                summary: 'Example Event',
                description: 'It works ;)',
                location: 'my room',
                url: 'http://sebbo.net/'
            });
            cal.saveSync(eventPath);
        }

        MailController.getEmailsByGroup(request.body.groups).then(mails => {
            const reg = /<img alt="calendar_img-([1-31]+)-([1-12]+)" src="">/g;
            mails = ['langejanneck@gmail.com'];//todo remove after debug
            for (let i = 0; i < mails.length; i++) {
                let content = request.body.text
                    .replace(/(?:\r\n|\r|\n)/g, '<br>')
                    .replace(reg, (match)=>{
                       console.log(match)
                    });

                MailController.sendMail(mails[i], request.body.subject, request.body.replyTo, content, eventPath);
            }
            response.status(200);
        })
    }

    /**
     * return promise<string[]> with all emails for the requested groups
     * @param groups
     */
    private static getEmailsByGroup(groups): Promise<string[]> {
        let mails = [];
        return new Promise(async (resolve, reject) => {
            //when groups is not a array.
            try {
                groups.forEach(x => x);
            } catch (e) {
                groups = [groups];
            }

            for (let i = 0; i < groups.length; i++) {
                await User.find({'group': groups[i]}).then(users => {
                    for (let j = 0; j < users.length; j++) {
                        mails.push(users[j]['name_first'] + '<' + users[j]['email'] + '>');//todo remove thrash
                    }
                });
            }
            resolve(mails);
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

    /**
     * Create a Calender Img with Month and Date as base64
     * @param day
     * @param month
     * @param width
     * @param imgPath
     * @return {Promise<string>}
     */
    private static async drawCalendar(day, month, width, imgPath) {
        const {createCanvas, loadImage} = require('canvas');
        const canvas = createCanvas(width, width);
        const ctx = canvas.getContext('2d');
        let image = await loadImage(imgPath);
        ctx.drawImage(image, 0, 0, width, width);

        //Day
        ctx.font = 0.5 * width + 'px Impact';
        let text_with = ctx.measureText(day);
        ctx.fillText(day, (width / 2) - (text_with.width / 2), (width / 2) + (text_with.emHeightAscent / 2));

        //Month
        ctx.font = 0.15 * width + 'px Impact';
        text_with = ctx.measureText(month);
        ctx.fillText(month, (width / 2) - (text_with.width / 2), 0.2 * width);

        return canvas.toDataURL();
    }


}
