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
            .get(function (req, res, next) {//tests the RESTful API
                res.status(200).json(
                    {
                        status: 200,
                        key:147261234,
                        message: "RESTful API works.",
                    }
                );
            })
            .post(token, function (req, res, next) {//tests if the token is valid
                res.status(200).json(
                    {
                        status: 200,
                        message: "Token is correct.",
                        userID: req.decoded.userID,
                        email: req.decoded.email,
                        role: req.decoded.role,
                        userNameFirst: req.decoded.userNameFirst,
                        userNameLast: req.decoded.userNameLast,
                    }
                );
            });
    }
}

const indexRouter = new Index();
indexRouter.init();

export default indexRouter.router;
