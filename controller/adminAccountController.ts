import express from "../expressApp";

import {Errors} from "../errors";
import {ErrorREST} from "../errors";

import {user as modelUser} from "../models/userModel";

export class AdminAccount {

    /**
     * todo
     * get all data from all users
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static getAllUsers(request, response, next):void{
        if (express.get('DEBUG') || request.decoded.role === 'admin') {
            modelUser.find().then(data => response.json(data)).catch(next);
        } else {
            return next(new ErrorREST(Errors.Forbidden));
        }
    }

    /**
     * todo
     * get all data from one user
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static getOneUser(request, response, next){
        let requestedUserID = request.params.id;
        let ownUserID =  request.decoded.userID;

        modelUser.findById(requestedUserID).then(
            user => {
                if(user) {
                    response.status(200).json(user)
                } else {
                    return next(new ErrorREST(Errors.NotFound, "User does not exist."));
                }
            }
        ).catch(next);
    }

    /**
     * For debug and testing, remove all users at once
     * permission: admin
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    public static deleteAll(request, response, next) {
        if (express.get('DEBUG') || request.decoded.role === 'admin') {
            modelUser.deleteMany().then(data => response.json(data)).catch(next);
        } else {
            return next(new ErrorREST(Errors.Forbidden));
        }
    }

    /**
     * delete user by id in params
     * permission: admin
     * todo permission check
     * @param request
     * @param response
     * @param next
     */
    public static deleteUser(request, response, next){
        let requestedUserID = request.params.id;
        let ownUserID =  request.decoded.userID;

        modelUser.remove({_id: requestedUserID}).then(user => response.json({removedElements: user})).catch(next);
    }


    /**
     * todo
     * get a list of users with not activated accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static getNotActivatedUsers(request, response, next) {
        //modelUser.find().then(data => response.json(data)).catch(next);

        response.status(Errors.NoContent.status).json();
    }

    /**
     * todo
     * activate a specific users account
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static activateUser(request, response, next) {


        response.status(Errors.NoContent.status).json();
    }

    /**
     * todo
     * get a list of disabled accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static getDisabledUsers(request, response, next) {


        response.status(Errors.NoContent.status).json();
    }

    /**
     * todo
     * disable or enable a specific user account
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
    public static changeDisable(request, response, next) {


        response.status(Errors.NoContent.status).json();
    }

    /**
     * todo
     * get a list of inactive accounts
     * permission: admin
     * @param request
     * @param response
     * @param next
     */
     public static getInactiveUsers(request, response, next): void
    {


        response.status(Errors.NoContent.status).json();
    }
}
