import {User} from "../models/userModel";
import express from "../expressApp";

import {ErrorREST, Errors} from "../errors";


export class UserController {
    /**
     * For debug and testing, show all users at once
     * todo move to AdminAccount
     * todo return only names and group
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    static getAll(request, response, next) {
        if (express.get('DEBUG') || request.decoded.role === 'admin') {
            User.find().then(data => response.json(data)).catch(next);
        } else {
            return next(new ErrorREST(Errors.Forbidden));
        }
    }

    /**
     * add a new user to database
     * @param request
     * @param result
     * @param next
     * @returns {Promise<void>}
     */
    static async addUser(request, result, next) {
        if (await User.findOne({email: request.body.email}).lean().exec())
            return next(new ErrorREST(Errors.Forbidden, "A user with the provided email already exists"));

        let user = new User(request.body);
        user.validate(err => {
            if (err)
                for (let errName in err.errors)
                    if (err.errors[errName].name === 'ValidatorError')
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message))
        });
        await user.save().then(user => result.status(200).json(user)).catch(next);
    }

    /**
     * todo set the profile picture
     * todo check if user has permission
     * @param request
     * @param response
     * @param next
     */
    static setProfilePicture(request, response, next) {
        response.status(Errors.NoContent.status).json();
    }

    /**
     * get user by id in params
     * todo permission check
     * todo return only names and group
     * @param request
     * @param response
     * @param next
     */
    static getUser(request, response, next) {
        let requestedUserID = request.params.id;
        let ownUserID = request.decoded.userID;

        User.findById(requestedUserID).then(
            user => {
                if (user) {
                    response.status(200).json(user)
                } else {
                    return next(new ErrorREST(Errors.NotFound, "User does not exist."));
                }
            }
        ).catch(next);
    }


    /**
     * todo send verification email to given email
     * todo confirm and update email in another method
     * @param request
     * @param response
     * @param next
     */
    static updateEmail(request, response, next) {


        response.status(Errors.NoContent.status).json({});
    }

    /**
     * todo confirm old password, than update new password
     * @param request
     * @param response
     * @param next
     */
    static updatePassword(request, response, next) {


        response.status(Errors.NoContent.status).json({});
    }

    /**
     * update everything in the user model except email and password
     * todo check witch data is given
     * todo update new data
     * @param request
     * @param response
     * @param next
     */
    static updateUser(request, response, next) {


        response.status(Errors.NoContent.status).json({});
    }
}
