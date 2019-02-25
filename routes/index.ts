import {Router} from "express";
import {verifyToken as token} from "./token";

class Index {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(function (req, res, next) {//test the RESTful API
                res.status(200).json(
                    {
                        status: 200,
                        message: "RESTful API works.",
                    }
                );
            })
            .post(token, function (req, res, next) {//test if the token is valid
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
