import App from "../expressApp";

import * as jwt from "jsonwebtoken";

import {ErrorREST, Errors} from "../errors";

/**
 * This is just called by the router and checks the status of a given token.
 * @param request
 * @param response
 * @param next
 */
export function verifyToken(request, response, next) {
    // Extract token from header / url parameters / post parameters
    let token = request.body.token;
    if (token) {
        jwt.verify(token, App.get('salt'),  (error, decoded) => {
                if (error) {
                    return next(new ErrorREST("Unauthorized"));
                }
                // Save to request for use in other routes
                request.decoded = decoded;
                next();
            });
    } else {
        //return next(new ErrorREST(Errors.BadRequest, "Token required."));
        return next(new ErrorREST("Unauthorized"));
    }
}
