import {ErrorREST, Errors} from "../errors";

let request = require('request');

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

export enum Stufe {
    ALLE = "",
    WOE = 1,
    JUPFI = 2,
    PFADI = 3,
    ROVER = 4,
    STAVO = 5,
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

//contains the untergliederungId for the search request
    constructor(loginName, password, groupId) {
        request.defaults({jar: true});
        this.loginName = loginName;
        this.password = password;
        this.host = "https://nami.dpsg.de";
        this.authURL = "/ica/rest/nami/auth/manual/sessionStartup";
        this.cookieJar = request.jar();
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
            request.post({
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
                    request.get({
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
    }

    /**
     * get some details from all members matching search criteria
     * @param request
     * @param response
     * @param next
     */
    private searchMember(request, response, next) {
        if (this.status !== Status.CONNECTED) {
            return next(new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search"));
        }

        let searchedValues = {
            // mglStatusId: "AKTIV",
            // mglTypeId: "MITGLIED",
            untergliederungId: Stufe.ALLE,
            taetigkeitId:' '
        };

        let params = {
            searchedValues: JSON.stringify(searchedValues),
            page: 1,
            start: 0,
            limit: 999999
        };

        request.get({
            url: `${this.host}/ica/rest/api/${this.apiMajor}/${this.apiMinor}/service/nami/search/result-list`,
            qs: params,
            useQueryString: true,
            jar: this.cookieJar
        }, (error, response, body) => {
            response.status(200).json(JSON.parse(body).data);
        })
    }

    /**
     * return a list of all members
     * @param request
     * @param response
     * @param next
     */
    public static getAllMemberForGroup(request, response, next) {
        let nami = new NamiAPI('203636', 'yx*&M%nD3pT$6C', 350716);
        nami.startSession().then(()=>{
            if (nami.status !== Status.CONNECTED) {
                return next(new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search"));
            }
            let params = {
                page: 1,
                start: 0,
                limit: 999999
            };

            request.get({
                url: `${nami.host}/ica/rest/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${nami.groupId}`,
                qs: params,
                useQueryString: true,
                jar: nami.cookieJar
            }, (error, response, body) => {
                console.log(error)
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
        let nami = new NamiAPI('203636', 'yx*&M%nD3pT$6C', 350716);
        nami.startSession().then(()=>{
            if (nami.status !== Status.CONNECTED) {
                return next(new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search"));
            }
            let params = {
                page: 1,
                start: 0,
                limit: 999999
            };

            request.get({
                url: `${nami.host}/ica/rest/api/${nami.apiMajor}/${nami.apiMinor}/service/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${nami.groupId}/${request.params.id}`,
                qs: params,
                useQueryString: true,
                jar: nami.cookieJar
            }, (error, response, body) => {
                console.log(error)
                response.status(200).json(JSON.parse(body).data);
            });
        }, (error) => {
            response.status(200).json("Nami Anmeldung fehlgeschlagen. Fehler: " + error)
        });
    }
}
