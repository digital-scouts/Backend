import {Router} from "express";
import {NamiAPI} from "../../controller/namiController";

class Nami {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/member')
            .get(NamiAPI.getAllMemberForGroup);

        this.router.route('/member/:id')
            .get(NamiAPI.getOneMemberFromGroupById)
    }
}


const namiRouter = new Nami();
namiRouter.init();

export default namiRouter.router;
