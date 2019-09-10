import {User} from '../models/userModel';
import {Group} from '../models/groupModel';
import {ErrorREST, Errors} from '../errors';
import {NamiAPI} from './namiController';


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
        if (request.decoded) {
            User.find({'role': request.decoded.role}).then(data => response.json(data)).catch(next);
        } else {
            User.find().then(data => response.json(data)).catch(next);
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
        if (await User.findOne({email: request.body.email}).lean().exec()) {
            return next(new ErrorREST(Errors.Forbidden, 'A user with the provided email already exists'));
        }

        let user = new User(request.body);
        user.validate(err => {
            if (err) {
                for (let errName in err.errors) {
                    if (err.errors[errName].name === 'ValidatorError') {
                        return next(new ErrorREST(Errors.UnprocessableEntity, err.errors[errName].message));
                    }
                }
            }
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
     * @param request
     * @param response
     * @param next
     */
    static getUser(request, response, next) {
        let requestedUserID = request.params.id;
        let ownUserID = request.decoded.userID;

        User.findById(requestedUserID, {
            name_first: 1,
            name_last: 1,
            image_profile: 1,
            role: 1
        }).then(user => {
                if (user) {
                    response.status(200).json(user);
                } else {
                    return next(new ErrorREST(Errors.NotFound, 'User does not exist.'));
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
     *
     * @param request
     * @param response
     * @param next
     */
    static updateNamiLink(request, response, next) {
        User.findByIdAndUpdate(request.query.id, {$set: {'accountStatus.namiLink': request.body.nami}}, {new: true}, (err, doc) => {
            if (err) {
                response.status(Errors.BadRequest.status, 'No user with this id found').json(err);
            }
            response.json(doc);
        });
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

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static async getAllUserByGroupWithNamiInfo(request, response, next) {
        let namiFilter = '';
        let dbUser;
        if (request.query.group) {
            let groupId = request.query.group;
            let group = await Group.findById(groupId);
            namiFilter = group.name.toLowerCase();
            dbUser = await User.find({'group': groupId}).populate('group');
        } else {
            dbUser = await User.find().populate('group');
        }

        //load nami User
        let namiUserList = await NamiAPI.getAllMembers(namiFilter);
        let promiseExecution = [];
        for (let i = 0; i < namiUserList['length']; i++) {
            promiseExecution.push(NamiAPI.getOneMember(namiUserList[i]['id']));
        }
        let namiUser = await Promise.all(promiseExecution);

        let allUsers = [];

        //push all nami user to array with db data if exist
        for (let i = 0; i < namiUser['length']; i++) {
            let user = dbUser.find(user => {
                return '' + user['accountStatus']['namiLink'] === '' + namiUser[i]['mitgliedsNummer'];
            });
            if (user) {
                let index = dbUser.indexOf(user);
                if (index > -1) {
                    dbUser.splice(index, 1);
                }
            }
            allUsers.push({
                dbData: user ? {
                    image_profile: user['image_profile'],
                    id: user['_id'],
                    name_first: user['name_first'],
                    name_last: user['name_last'],
                    email: user['email'],
                    role: user['role'],
                    group: user['group'],
                    accountStatus: user['accountStatus']
                } : null,
                namiData: {
                    mitgliedsNummer: namiUser[i]['mitgliedsNummer'],
                    vorname: namiUser[i]['vorname'],
                    nachname: namiUser[i]['nachname'],
                    eintrittsdatum: namiUser[i]['eintrittsdatum'],
                    status: namiUser[i]['status'],
                    telefon1: namiUser[i]['telefon1'],
                    telefon2: namiUser[i]['telefon2'],
                    telefon3: namiUser[i]['telefon3'],
                    telefax: namiUser[i]['telefax'],
                    emailVertretungsberechtigter: namiUser[i]['emailVertretungsberechtigter'],
                    email: namiUser[i]['email'],
                    strasse: namiUser[i]['strasse'],
                    plz: namiUser[i]['plz'],
                    ort: namiUser[i]['ort'],
                    geburtsDatum: namiUser[i]['geburtsDatum'],
                    stufe:namiUser[i]['stufe'],
                }
            });
        }

        //push remaining db users
        for (let i = 0; i < dbUser['length']; i++) {
            allUsers.push({
                dbData: {
                    image_profile: dbUser[i]['image_profile'],
                    id: dbUser[i]['_id'],
                    name_first: dbUser[i]['name_first'],
                    name_last: dbUser[i]['name_last'],
                    email: dbUser[i]['email'],
                    role: dbUser[i]['role'],
                    group: dbUser[i]['group'],
                    accountStatus: dbUser[i]['accountStatus']
                },
                namiData: null
            });
        }

        response.json(allUsers);
    }
}
