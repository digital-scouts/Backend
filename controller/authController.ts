import {User} from "../models/userModel";
import * as jwt from "jsonwebtoken";
import {Errors, ErrorREST} from "../errors";
import * as config from '../config';

export class AuthController {
    /**
     * Checks for given email, which serves as username and needs to be unique and a password.
     * When a matching entry is found it returns the token for the user which expires
     * after a given time.
     * The token also includes the userID and his role.
     * @param request ?email=&password=
     * @param response
     * @param next
     * @returns {Promise<*>}
     */
    public static async authenticate(request, response, next) {
        if (!request.body.email) {
            return next(new ErrorREST(Errors.BadRequest, "User name missing."));
        } else if (!request.body.password) {
            return next(new ErrorREST(Errors.BadRequest, "Password missing."));
        }

        User.findOne({email: request.body.email}).then(processData).catch(next);

        function processData(user) {
            if (!user) {
                return next(new ErrorREST(Errors.Unauthorized, "User does not exist."));
            } else {
                let passwordCorrect = user.password === request.body.password;

                if (!passwordCorrect) {
                    return next(new ErrorREST(Errors.Unauthorized, "Wrong password."));
                } else {
                    const payload = {
                        email: user.email,
                        role: user.role,
                        userID: user._id,
                        userNameFirst: user.name_first,
                        userNameLast: user.name_last
                    };

                    response.status(200).json(
                        {
                            status: 200,
                            message: "Request successful.",
                            role: user.role,
                            userID: user._id,
                            userNameFirst: user.name_first,
                            userNameLast: user.name_last,
                            token: jwt.sign(payload, config.Config.salt, {expiresIn: 86400})//one week
                        }
                    );
                }
            }
        }
    }
}
