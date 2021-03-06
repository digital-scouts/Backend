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
        User.find()
            .populate('group')
            .sort({'name_last': 1})
            .then(data => response.json(data)).catch(next);
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
                    return next(new ErrorREST(Errors.NotFound, "User does not exist."));
                }
            }
        ).catch(next);
    }

    /**
     * delete user by id in params
     * @param request
     * @param response
     * @param next
     */
    public static deleteUser(request, response, next) {
        if(request.query.id){
            User.remove({_id: request.query.id}).then(user => response.json({removedElements: user})).catch(next);
        }else{
            User.deleteMany().then(data => response.json(data)).catch(next);
        }
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
     * activate a specific users account and set namiLink when possible
     * @param request
     * @param response
     * @param next
     */
    public static activateUser(request, response, next) {
        let updateQuery = {
            'accountStatus.activated': true
        };

        if(request.query.namiLink){
            updateQuery['accountStatus.namiLink'] = request.query.namiLink;
        }
        User.findByIdAndUpdate(request.query.id, {$set: updateQuery}, {new: true}, (err, doc) => {
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
        await User.findById(request.query.id, (err, doc) => {
            isDisabled = doc.accountStatus.disabled;
        });

        User.findByIdAndUpdate(request.query.id, {$set: {'accountStatus.disabled': !isDisabled}}, {new: true}, (err, doc) => {
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
