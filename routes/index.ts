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
                res.status(200).json(
                    {
                        status: 200,
                        message: "RESTful API works.",
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
