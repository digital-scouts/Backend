import {Router} from "express";
import {MailController} from "../../controller/mailController";

class Mail {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(MailController.send);
    }
}


const mailRouter = new Mail();
mailRouter.init();

export default mailRouter.router;
