import {Router} from "express";
import {DebugController} from "../../controller/debugController";


class Debug {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .post(DebugController.initData)
            .delete(DebugController.deleteDB);

    }
}


const debugRouter = new Debug();
debugRouter.init();

export default debugRouter.router;
