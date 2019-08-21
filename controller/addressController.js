var errors_1 = require("../errors");
var addressModel_1 = require("../models/addressModel");
var AddressController = (function () {
    function AddressController() {
    }
    AddressController.deleteAddress = function (request, response, next) {
        return next(new errors_1.ErrorREST(errors_1.Errors.NoContent));
    };
    AddressController.createAddress = function (request, response, next) {
        var address = new addressModel_1.Address({
            name: request.body.name,
            plz: request.body.plz != undefined ? request.body.plz : null,
            city: request.body.city != undefined ? request.body.city : null,
            street: request.body.street != undefined ? request.body.street : null,
            nr: request.body.nr != undefined ? request.nr.plz : null,
            otherAddressInfo: request.body.otherAddressInfo != undefined ? request.body.otherAddressInfo : null,
        });
        address.validate(async, function (err) {
            if (err)
                for (var errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError') {
                        console.log(errors_1.Errors.UnprocessableEntity + " " + err.errors[errName].message);
                        return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
                    }
            address.save().then(function (event) { return response.status(200).json(event); }).catch(next);
        });
    };
    AddressController.getAddress = function (request, response, next) {
        addressModel_1.Address.find().then(function (data) { return response.json(data); }).catch(next);
    };
    return AddressController;
})();
exports.AddressController = AddressController;
//# sourceMappingURL=addressController.js.map