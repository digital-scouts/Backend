var errors_1 = require("../errors");
var errors_2 = require("../errors");
var userModel_1 = require("../models/userModel");
var AdminAccount = (function () {
    function AdminAccount() {
    }
    /**
     * get all data from all users
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getAllUsers = function (request, response, next) {
        userModel_1.User.find()
            .populate('group')
            .sort({ 'name_last': 1 })
            .then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * get all data from one user
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getOneUser = function (request, response, next) {
        // let requestedUserID = request.params.id;
        userModel_1.User.findById(request.params.id).then(function (user) {
            if (user) {
                response.status(200).json(user);
            }
            else {
                return next(new errors_2.ErrorREST(errors_1.Errors.NotFound, "User does not exist."));
            }
        }).catch(next);
    };
    /**
     * delete user by id in params
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.deleteUser = function (request, response, next) {
        if (request.query.id) {
            userModel_1.User.remove({ _id: request.query.id }).then(function (user) { return response.json({ removedElements: user }); }).catch(next);
        }
        else {
            userModel_1.User.deleteMany().then(function (data) { return response.json(data); }).catch(next);
        }
    };
    /**
     * get a list of users with not activated accounts
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getNotActivatedUsers = function (request, response, next) {
        userModel_1.User.find({ 'accountStatus.activated': false }).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * activate a specific users account and set namiLink when possible
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.activateUser = function (request, response, next) {
        var updateQuery = {
            'accountStatus.activated': true
        };
        if (request.query.namiLink) {
            updateQuery['accountStatus.namiLink'] = request.query.namiLink;
        }
        userModel_1.User.findByIdAndUpdate(request.query.id, { $set: updateQuery }, { new: true }, function (err, doc) {
            if (err)
                response.status(errors_1.Errors.BadRequest.status, "No user with this id found").json(err);
            response.json(doc);
        });
    };
    /**
     * get a list of disabled accounts
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.getDisabledUsers = function (request, response, next) {
        userModel_1.User.find({ 'accountStatus.disabled': true }).then(function (data) { return response.json(data); }).catch(next);
    };
    /**
     * disable or enable a specific user account
     * @param request
     * @param response
     * @param next
     */
    AdminAccount.async = changeDisable(request, response, next);
    return AdminAccount;
})();
exports.AdminAccount = AdminAccount;
{
    var isDisabled = false;
    await;
    userModel_1.User.findById(request.query.id, function (err, doc) {
        isDisabled = doc.accountStatus.disabled;
    });
    userModel_1.User.findByIdAndUpdate(request.query.id, { $set: { 'accountStatus.disabled': !isDisabled } }, { new: true }, function (err, doc) {
        if (err)
            response.status(errors_1.Errors.BadRequest.status, "No user with this id found").json(err);
        response.json(doc);
    });
}
getInactiveUsers(request, response, next);
void {
    User: .find({ 'accountStatus.inactive': true }).then(function (data) { return response.json(data); }).catch(next)
};
//# sourceMappingURL=adminAccountController.js.map