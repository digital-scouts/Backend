import {ErrorREST, Errors} from "../errors";
import {_helper, _helper as Helper} from "./_helper";
import {Address} from "../models/addressModel";

export class AddressController {

    static deleteAddress(request, response, next) {
        return next(new ErrorREST(Errors.NoContent));

    }

    static createAddress(request, response, next) {
        let address = new Address({
            name: request.body.name,
            plz: request.body.plz != undefined ? request.body.plz : null,
            city: request.body.city != undefined ? request.body.city : null,
            street: request.body.street != undefined ? request.body.street : null,
            nr: request.body.nr != undefined ? request.nr.plz : null,
            otherAddressInfo: request.body.otherAddressInfo != undefined ? request.body.otherAddressInfo : null,
        });

        address.validate(async err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError') {
                        console.log(Errors.UnprocessableEntity + " " + err.errors[errName].message);
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                    }

            address.save().then(event => response.status(200).json(event)).catch(next);
        });
    }

    static getAddress(request, response, next) {
        Address.find().then(data => response.json(data)).catch(next);
    }
}
