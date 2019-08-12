import {ErrorREST, Errors} from "../errors";
import {rejects} from "assert";

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

export enum Group {
    //connection hasn't started
    WOELFLING = 1,
    //authentication has started
    JUNGPFADFINDER = 2,
    // client is connected
    PFADFINDER = 3,
    // an error occurred
    ROVER = 4
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
    public static async getAllMemberForGroup(request, response, next) {
        try {
            response.status(200).json(await NamiAPI.getAllMembers(request.query.filterString));
        } catch (e) {
            response.status(400);
        }
    }

    /**
     * get all details from one member
     * @param request
     * @param response
     * @param next
     */
    public static async getOneMemberFromGroupById(request, response, next) {
        try {
            response.status(200).json(await NamiAPI.getOneMember(request.params.id));
        } catch (e) {
            response.status(400);
        }
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    public static async getEmailsByFilter(request, response, next) {
        try {
            response.status(200).json(await NamiAPI.getAllEmailsByFilter(request.query.filter));
        } catch (e) {
            response.status(400);
        }
    }

    /**
     * return name and id for all members
     * @param filterString
     */
    private static getAllMembers(filterString: string = ""): Promise<JSON> {
        return new Promise<JSON>((resolve) => {
            NamiAPI.nami.startSession().then(() => {
                if (NamiAPI.nami.status !== Status.CONNECTED) {
                    throw new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search");
                }
                let params = {
                    page: 1,
                    start: 0,
                    limit: 999999
                };

                let query = "";
                if (filterString != null && filterString != "") {
                    query = '?filterString=' + filterString;
                }

                apiClient.get({
                    url: `${NamiAPI.nami.host}/ica/rest/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${NamiAPI.nami.groupId}${query}`,
                    qs: params,
                    useQueryString: true,
                    jar: NamiAPI.nami.cookieJar
                }, (error, namiResponse, body) => {
                    resolve(JSON.parse(body).data);
                });
            }, (error) => {
                throw new ErrorREST(Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
            });
        })

    }

    /**
     * return all data from one member
     * @param memberId
     */
    private static getOneMember(memberId: string): Promise<JSON> {
        return new Promise<JSON>((resolve, reject) => {
            NamiAPI.nami.startSession().then(() => {
                if (NamiAPI.nami.status !== Status.CONNECTED) {
                    throw new ErrorREST(Errors.Forbidden, "Nami: Authenticate before trying to search");
                }
                let params = {
                    page: 1,
                    start: 0,
                    limit: 999999
                };

                apiClient.get({
                    url: `${NamiAPI.nami.host}/ica/rest/api/${NamiAPI.nami.apiMajor}/${NamiAPI.nami.apiMinor}/service/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/${NamiAPI.nami.groupId}/${memberId}`,
                    qs: params,
                    useQueryString: true,
                    jar: NamiAPI.nami.cookieJar
                }, (error, namiResponse, body) => {
                    resolve(JSON.parse(body).data);
                });
            }, (error) => {
                throw new ErrorREST(Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
            });
        });

    }

    /**
     * return a array of with emails from the member
     * @param memberId
     */
    private static async getAllEmailsById(memberId: string) {
        let emails = [];
        let member = await NamiAPI.getOneMember(memberId);
        if (member['email'])
            emails.push(`${member['vorname']} ${member['nachname']}<${member['email']}>`);
        if (member['emailVertretungsberechtigter'])
            emails.push(`Fam. ${member['nachname']}<${member['emailVertretungsberechtigter']}>`);

        return emails;
    }

    /**
     * get all emails from all members (by filter) and return a array
     * @param filter
     */
    private static getAllEmailsByFilter(filter: string) {
        return new Promise((resolve) => {
            let emails = [];
            NamiAPI.getAllMembers(filter).then(async (data) => {
                // @ts-ignore
                for (let i = 0; i < data.length; i++) {
                    // @ts-ignore
                    console.log(Math.round((i+1)/data.length*100) + '%')
                    emails = emails.concat(await NamiAPI.getAllEmailsById(data[i]['id']));
                }
                resolve(emails);
            });

        });
    }


}
