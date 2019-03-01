import {Router} from "express";

import {AdminAccount} from "../../controller/adminAccountController";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";


class AdminAccounts {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/user')
            .get(token, permission, AdminAccount.getAllUsers)
            .delete(token, permission, AdminAccount.deleteAll);

        this.router.route('/user/:id')
            .get(token, permission, AdminAccount.getOneUser)
            .delete(token, permission, AdminAccount.deleteUser);

        this.router.route('/notActivated')
            .get(token, permission, AdminAccount.getNotActivatedUsers);

        this.router.route('/notActivated/:id')
            .put(token, permission, AdminAccount.activateUser);

        this.router.route('/disabled')
            .get(token, permission, AdminAccount.getDisabledUsers);

        this.router.route('/disabled/:id')
            .put(token, permission, AdminAccount.changeDisable);

        this.router.route('/inactive')
            .get(token, permission, AdminAccount.getInactiveUsers);

    }
}

const adminAccountsRouter = new AdminAccounts();
adminAccountsRouter.init();

export default adminAccountsRouter.router;
