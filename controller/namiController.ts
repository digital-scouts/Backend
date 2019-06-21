import {ErrorREST, Errors} from "../errors";

let apiClient = require('request');

export enum Status {
    //connection hasn't started
    IDLE = 1,
    //authentication has started
    AUTH = 2,
    // client is connected
    CONNECTED = 3,
    // an error occurred
    ERROR = 99
}


/**
 * Promise based Class for communication with DPSG Namentliche Mitgliedermeldung
 */
export class NamiAPI {
    loginName: string;
    password: string;
    host: string;
    authURL: string;
    cookieJar: any;
    status: Status;
    apiMajor: any;
    apiMinor: any;
    groupId: number;

    private static nami = new NamiAPI('XXX', 'XXX', 350716); //todo save login data

//contains the untergliederungId for the search request
    constructor(loginName, password, groupId) {
        apiClient.defaults({jar: true});
        this.loginName = loginName;
        this.password = password;
        this.host = "https://nami.dpsg.de";
        this.authURL = "/ica/rest/nami/auth/manual/sessionStartup";
        this.cookieJar = apiClient.jar();
        this.status = Status.IDLE;
        this.apiMajor = null;
        this.apiMinor = null;
        this.groupId = groupId;
    }

    /**
     * Logs in the User.
     * Returns Promise which is resolved once the user is logged in
     */
    startSession(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            //do not start a new session if one is already in progress
            if (this.status === Status.CONNECTED) {
                resolve(true);
                return;
            }

            if (this.status === Status.AUTH) {
                console.warn("Auth Cancelled: Current Nami Status is AUTH");
                resolve(false);
                return;
            }
            this.status = Status.AUTH;
            apiClient.post({
                url: this.host + this.authURL,
                jar: this.cookieJar,
                form: {
                    username: this.loginName,
                    password: this.password,
                    Login: "API",
                    redirectTo: "./pages/loggedin.jsp"
                }
            }, (error, response, body) => {
                if (error) {
                    this.status = Status.ERROR;
                    reject(error);
                    return;
                }
                if (response.statusCode === 302) {
                    apiClient.get({
                        url: response.headers.location,
                        jar: this.cookieJar
                    }, (error2, response2, body2) => {
                        if (error2) {
                            this.status = Status.ERROR;
                            reject(error);
                            return;
                        }
                        if (response2.statusCode !== 200) {
                            this.status = Status.ERROR;
                            reject("AUTH Error: status code != 200 (in second response). Response:\n" + JSON.stringify(response2.toJSON()));
                            return;
                        }
                        console.log("Successfully connected to Nami");
                        this.status = Status.CONNECTED;
                        body2 = JSON.parse(body2);
                        this.apiMajor = body2.majorNumber;
                        this.apiMinor = body2.minorNumber;
                        resolve(true)
                    })
                } else {
                    this.status = Status.ERROR;

                    try {
                        body = JSON.parse(body);
                    } catch (err) {
                        reject("AUTH Error: status code != 302. Response:\n" + JSON.stringify(response.toJSON()))
                    }
                    reject(body.statusMessage)
                }
            })
        });
    }

    /**
     * return a list of all members
     * @param request
     * @param response
     * @param next
     */
    public static getAllMemberForGroup(request, response, next) {
        NamiAPI.nami.startSession().then(() => {
            if (NamiAPI.nami.status !== Status.CONNECTED) {
                return next(new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search"));
            }
            let params = {
                page: 1,
                start: 0,
                limit: 999999
            };

            apiClient.get({
                url: `${NamiAPI.nami.host}/ica/rest/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${NamiAPI.nami.groupId}`,
                qs: params,
                useQueryString: true,
                jar: NamiAPI.nami.cookieJar
            }, (error, namiResponse, body) => {
                response.status(200).json(JSON.parse(body).data);
            });
        }, (error) => {
            response.status(200).json("Nami Anmeldung fehlgeschlagen. Fehler: " + error)
        });
    }

    /**
     * get all details from one member
     * @param request
     * @param response
     * @param next
     */
    public static getOneMemberFromGroupById(request, response, next) {
        NamiAPI.nami.startSession().then(() => {
            if (NamiAPI.nami.status !== Status.CONNECTED) {
                return next(new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search"));
            }
            let params = {
                page: 1,
                start: 0,
                limit: 999999
            };

            apiClient.get({
                url: `${NamiAPI.nami.host}/ica/rest/api/${NamiAPI.nami.apiMajor}/${NamiAPI.nami.apiMinor}/service/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${NamiAPI.nami.groupId}/${request.params.id}`,
                qs: params,
                useQueryString: true,
                jar: NamiAPI.nami.cookieJar
            }, (error, namiResponse, body) => {
                response.status(200).json(JSON.parse(body).data);
            });
        }, (error) => {
            response.status(200).json("Nami Anmeldung fehlgeschlagen. Fehler: " + error)
        });
    }
}
