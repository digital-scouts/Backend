import {Router} from "express";

import {AdminAccount} from "../../controller/adminAccountController";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";


class AdminAccounts{
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/user')
            .get(token, permission, AdminAccount.getAllUsers)
            .delete(token, AdminAccount.deleteAll);

        this.router.route('/user/:id')
            .get(token, AdminAccount.getOneUser)
            .delete(token, AdminAccount.deleteUser);

        this.router.route('/notActivated')
            .get(token, AdminAccount.getNotActivatedUsers)
            .put(token, AdminAccount.activateUser);

        this.router.route('/disabled')
            .get(token, AdminAccount.getDisabledUsers)
            .put(token, AdminAccount.changeDisable);

        this.router.route('/inactive')
            .get(token, AdminAccount.getInactiveUsers);

    }}

const adminAccountsRouter = new AdminAccounts();
adminAccountsRouter.init();

export default adminAccountsRouter.router;
