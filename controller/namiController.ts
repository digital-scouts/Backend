import {ErrorREST, Errors} from "../errors";
import {Config} from "./../config";
import {EmailSource} from "./mailController";
import {_helper} from "./_helper";
import {rejects} from 'assert';

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

    private static nami = new NamiAPI(Config.nami.user, Config.nami.pass, Config.nami.gruppierung);

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
            let emailArray = await NamiAPI.getAllEmailsByFilter(request.query.filter);
            // @ts-ignore
            response.status(200).json({list: emailArray.map(email => email.email).join(','), objects: emailArray});
        } catch (e) {
            response.status(400);
        }
    }

    /**
     * return name and id for all members
     * @param filterString
     */
    public static getAllMembers(filterString: string = null) {
        return new Promise((resolve, reject) => {
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
                if (filterString) {
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
                reject("Nami Anmeldung fehlgeschlagen. Fehler: " + error);
                // throw new ErrorREST(Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
            });
        })

    }

    /**
     * return all data from one member
     * @param memberId
     */
    public static getOneMember(memberId: string) {
        return new Promise((resolve, reject) => {
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
    private static async getAllEmailsById(memberId: string): Promise<{ childName: string, familyName: string, emailSource: EmailSource, email: string }[]> {
        let emails = [];
        let member = await NamiAPI.getOneMember(memberId);
        if (member['email']) {
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiMember,
                email: `${member['vorname']} ${member['nachname']} <${member['email']}>`
            });
        }
        if (member['emailVertretungsberechtigter']) {
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiVertretungsberechtigter,
                email: `Fam. ${member['nachname']} <${member['emailVertretungsberechtigter']}>`
            });
        }
        //hint it is possible to save text/email in telefax or telefon
        if(_helper.matchEmailRegex(member['telefax']).length){
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiSonstige,
                email: member['telefax']
            });
        }if( _helper.matchEmailRegex(member['telefon3']).length){
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiSonstige,
                email: member['telefon3']
            });
        }if( _helper.matchEmailRegex(member['telefon2']).length){
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiSonstige,
                email: member['telefon2']
            });
        }if( _helper.matchEmailRegex(member['telefon1']).length){
            emails.push({
                childName: member['vorname'],
                familyName: member['nachname'],
                emailSource: EmailSource.NamiSonstige,
                email: member['telefon1']
            });
        }

        return emails;
    }

    /**
     * get all emails from all members (by filter) and return a array
     * @param filter
     */
    public static getAllEmailsByFilter(filter: string = null): Promise<{ childName: string, familyName: string, emailSource: EmailSource, email: string }[]> {
        return new Promise((resolve) => {
            let emails = [];
            NamiAPI.getAllMembers(filter).then(async (data) => {

                // @ts-ignore
                for (let i = 0; i < data.length; i++) {
                    // @ts-ignore
                    console.log('Email-Adressen werden geladen: ' + Math.round((i + 1) / data.length * 100) + '%');
                    emails = emails.concat(await NamiAPI.getAllEmailsById(data[i]['id']));
                }
                resolve(emails);
            });

        });
    }


}
