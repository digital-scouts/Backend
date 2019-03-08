import {Router} from "express";
import {verifyToken as token} from "./token";
import * as jwt from "jsonwebtoken";
import * as config from '../config';

class Index {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(function (req, res, next) {//tests the RESTful API
                const adminPayload = {
                    email: "debugUser@admin.de",
                    role: "admin",
                    userID: "notSet",
                    userNameFirst: "debugUser",
                    userNameLast: "debugUser"
                };
                const woePayload = {
                    email: "debugUser@admin.de",
                    role: "admin",
                    userID: "notSet",
                    userNameFirst: "debugUser",
                    userNameLast: "debugUser"
                };
                const leaderPayload = {
                    email: "debugUser@admin.de",
                    role: "admin",
                    userID: "notSet",
                    userNameFirst: "debugUser",
                    userNameLast: "debugUser"
                };
                const parentPayload = {
                    email: "debugUser@admin.de",
                    role: "admin",
                    userID: "notSet",
                    userNameFirst: "debugUser",
                    userNameLast: "debugUser"
                };
                res.status(200).json(
                    {
                        status: 200,
                        message: "RESTful API works.",
                        debugAdminToken: jwt.sign(adminPayload, config.Config.salt, {expiresIn: 604800}),
                        debugWoeToken: jwt.sign(woePayload, config.Config.salt, {expiresIn: 604800}),
                        debugLeaderToken: jwt.sign(leaderPayload, config.Config.salt, {expiresIn: 604800}),
                        debugParentToken: jwt.sign(parentPayload, config.Config.salt, {expiresIn: 604800})
                    }
                );
            })
            .post(token, function (req, res, next) {//tests if the token is valid
                res.status(200).json(
                    {
                        status: 200,
                        message: "Token is correct.",
                    }
                );
            });
    }
}

const indexRouter = new Index();
indexRouter.init();

export default indexRouter.router;
