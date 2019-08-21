var express_1 = require("express");
var token_1 = require("../token");
var permission_1 = require("../permission");
var addressController_1 = require("../../controller/addressController");
var Address = (function () {
    function Address() {
        this.router = express_1.Router();
        this.init();
    }
    Address.prototype.init = function () {
        this.router.route('/')
            .post(token_1.verifyToken, permission_1.checkPermission, addressController_1.AddressController.createAddress)
            .get(token_1.verifyToken, permission_1.checkPermission, addressController_1.AddressController.getAddress);
        this.router.route('/:id')
            .delete(token_1.verifyToken, permission_1.checkPermission, addressController_1.AddressController.deleteAddress);
    };
    return Address;
})();
var addressRouter = new Address();
addressRouter.init();
exports.default = addressRouter.router;
//# sourceMappingURL=address.js.map