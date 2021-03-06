import {Router} from "express";

import {AdminAccount} from "../../controller/adminAccountController";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";
import {UserController} from "../../controller/userController";


class AdminAccounts {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/user')
            .get(token, permission, AdminAccount.getAllUsers)
            .delete(token, permission, AdminAccount.deleteUser);

        this.router.route('/user/:id')
            .get(token, permission, AdminAccount.getOneUser);

        this.router.route('/notActivated')
            .get(token, permission, AdminAccount.getNotActivatedUsers)
            .put(token, permission, AdminAccount.activateUser);

        this.router.route('/disabled')
            .get(token, permission, AdminAccount.getDisabledUsers)
            .put(token, permission, AdminAccount.changeDisable);

        this.router.route('/inactive')
            .get(token, permission, AdminAccount.getInactiveUsers);

        this.router.route('/debUser')
            .get(UserController.getAll);

    }
}

const adminAccountsRouter = new AdminAccounts();
adminAccountsRouter.init();

export default adminAccountsRouter.router;
