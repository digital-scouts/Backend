import {Router} from "express";


class Debug {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {


    }
}


const debugRouter = new Debug();
debugRouter.init();

export default debugRouter.router;
