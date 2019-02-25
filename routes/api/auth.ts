import {AuthController} from "../../controller/authController";
import {Router} from "express";

class Auth {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .post(AuthController.authenticate); // no token needed to login

    }
}


const authRouter = new Auth();
authRouter.init();

export default authRouter.router;
