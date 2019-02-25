"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expressApp_1 = require("../expressApp");
var jwt = require("jsonwebtoken");
var errors_1 = require("../errors");
/**
 * This is just called by the router and checks the status of a given token.
 * @param request
 * @param response
 * @param next
 */
function verifyToken(request, response, next) {
    // Extract token from header / url parameters / post parameters
    var token = request.body.token;
    if (token) {
        jwt.verify(token, expressApp_1.default.get('salt'), function (error, decoded) {
            if (error) {
                return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized));
            }
            // Save to request for use in other routes
            request.decoded = decoded;
            next();
        });
    }
    else {
        //return next(new ErrorREST(Errors.BadRequest, "Token required."));
        return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized));
    }
}
exports.verifyToken = verifyToken;
