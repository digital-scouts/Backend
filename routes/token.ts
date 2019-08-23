import * as jwt from "jsonwebtoken";
import {ErrorREST, Errors} from "../errors";
import * as config from '../config';

/**
 * This is just called by the router and checks the status of a given token.
 * @param request
 * @param response
 * @param next
 */
export function verifyToken(request, response, next) {
    // Extract token from header / url parameters / post parameters
    let token =  request.headers['x-access-token'] || request.headers['authorization'];
    if (token) {
        jwt.verify(token, config.Config.salt,  (error, decoded) => {
                if (error) {
                    return next(new ErrorREST(Errors.Unauthorized), "Token not valid: " +error);
                }
                // Save to request for use in other routes
                request.decoded = decoded;
                console.log('verifyToken: ' + request.decoded.email);
                next();
            });
    } else {
        return next(new ErrorREST(Errors.Unauthorized),"Token required.");
    }
}
