import {Router} from "express";
import {UserController} from "../../controller/userController";

import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

class Users {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token, permission,UserController.getAllUserByGroupWithNamiInfo)
            .post(UserController.addUser) //no token needed to create a account
            .put(token, permission, UserController.updateUser);

        this.router.route('/:id')
            .get(token, permission, UserController.getUser);

        this.router.route('/image')
            .put(token, permission, UserController.setProfilePicture);

        this.router.route('/password')
            .put(token, permission, UserController.updatePassword);

        this.router.route('/nami')
            .put(token, permission, UserController.updateNamiLink);

        this.router.route('/email')
            .put(token, permission, UserController.updateEmail);
    }
}

const usersRouter = new Users();
usersRouter.init();

export default usersRouter.router;

