import {Router} from "express";
import {UserController} from "../../controller/userController";

import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";

class Users{
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(token,permission, (re,rs,ne) => UserController.getAll(re,rs,ne))
            .post(UserController.addUser) //no token needed to create a account
            .put(token, UserController.updateUser);

        this.router.route('/:id')
            .get(token, permission, UserController.getUser);

        this.router.route('/image')
            .put(token, permission, UserController.setProfilePicture);

        this.router.route('/password')
            .put(token, UserController.updatePassword);

        this.router.route('/email')
            .put(token, UserController.updateEmail);
    }
}

const usersRouter = new Users();
usersRouter.init();

export default usersRouter.router;

