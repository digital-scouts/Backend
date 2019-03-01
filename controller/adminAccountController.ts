import express from "../expressApp";

import {Errors} from "../errors";
import {ErrorREST} from "../errors";
import {User} from "../models/userModel";

export class AdminAccount {

    /**
     * get all data from all users
     * @param request
     * @param response
     * @param next
     */
    public static getAllUsers(request, response, next): void {
        User.find().then(data => response.json(data)).catch(next);
    }

    /**
     * get all data from one user
     * @param request
     * @param response
     * @param next
     */
    public static getOneUser(request, response, next) {
        // let requestedUserID = request.params.id;

        User.findById(request.params.id).then(
            user => {
                if (user) {
                    response.status(200).json(user)
                } else {
                    return next(new ErrorREST("NotFound", "User does not exist."));
                }
            }
        ).catch(next);
    }

    /**
     * Remove all users at once
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    public static deleteAll(request, response, next) {
        User.deleteMany().then(data => response.json(data)).catch(next);
    }

    /**
     * delete user by id in params
     * @param request
     * @param response
     * @param next
     */
    public static deleteUser(request, response, next) {
        User.remove({_id: request.params.id}).then(user => response.json({removedElements: user})).catch(next);
    }


    /**
     * get a list of users with not activated accounts
     * @param request
     * @param response
     * @param next
     */
    public static getNotActivatedUsers(request, response, next) {
        User.find({'accountStatus.activated': false}).then(data => response.json(data)).catch(next);
    }

    /**
     * activate a specific users account
     * @param request
     * @param response
     * @param next
     */
    public static activateUser(request, response, next) {
        User.findByIdAndUpdate(request.params.id, {$set: {'accountStatus.activated': true}}, {new: true}, (err, doc) => {
            if (err)
                response.status(Errors.BadRequest.status, "No user with this id found").json(err);
            response.json(doc);
        });
    }

    /**
     * get a list of disabled accounts
     * @param request
     * @param response
     * @param next
     */
    public static getDisabledUsers(request, response, next) {
        User.find({'accountStatus.disabled': true}).then(data => response.json(data)).catch(next);
    }

    /**
     * disable or enable a specific user account
     * @param request
     * @param response
     * @param next
     */
    public static async changeDisable(request, response, next) {
        let isDisabled = false;
        await User.findById(request.params.id, (err, doc) => {
            isDisabled = doc.accountStatus.disabled;
        });

        User.findByIdAndUpdate(request.params.id, {$set: {'accountStatus.disabled': !isDisabled}}, {new: true}, (err, doc) => {
            if (err)
                response.status(Errors.BadRequest.status, "No user with this id found").json(err);
            response.json(doc);
        });
    }

    /**
     * get a list of inactive accounts
     * @param request
     * @param response
     * @param next
     */
    public static getInactiveUsers(request, response, next): void {
        User.find({'accountStatus.inactive': true}).then(data => response.json(data)).catch(next);
    }
}
