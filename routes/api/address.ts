import {AuthController} from "../../controller/authController";
import {Router} from "express";
import {verifyToken as token} from "../token";
import {checkPermission as permission} from "../permission";
import {AddressController} from "../../controller/addressController";

class Address {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .post(token,permission,AddressController.createAddress)
            .get(token, permission, AddressController.getAddress);

        this.router.route('/:id')
            .delete(token, permission, AddressController.deleteAddress);

    }
}


const addressRouter = new Address();
addressRouter.init();

export default addressRouter.router;
