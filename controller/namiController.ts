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

//contains the untergliederungId for the search request
    constructor(loginName, password) {
        request.defaults({jar: true});
        this.loginName = loginName;
        this.password = password;
        this.host = "https://nami.dpsg.de";
        this.authURL = "/ica/rest/nami/auth/manual/sessionStartup";
        this.cookieJar = request.jar();
        this.status = Status.IDLE;
        this.apiMajor = null;
        this.apiMinor = null;

    }

    getSearchURL() {
        return `${this.host}/ica/rest/api/${this.apiMajor}/${this.apiMinor}/service/nami/search/result-list`
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
        })
    }

    /**
     * Returns a promise to an array of members.
     * @param {Number} stufe  which group we should search for.
     * Use NamiAPI.Stufe for this
     * @param {*} leiter (bool) if the group leaders should be included or not. Defaults to true
     */
    listMembers(stufe, leiter = true) {
        let searchFor = {
            mglStatusId: "AKTIV",
            mglTypeId: "MITGLIED",
            untergliederungId: stufe
        };
        if (leiter !== null)
            searchFor['taetigkeitId'] = (leiter) ? 6 : " ";

        return this.search(searchFor)
    }

    /**
     * Returns a promise to the full search
     * @param {*} searchedValues what to search for. Possible keys (but not all of them); taetigkeitId, mglStatusId, mglTypeId, untergliederungId
     */
    search(searchedValues) {
        return new Promise((resolve, reject) => {
            if (this.status !== Status.CONNECTED) {
                reject("Authenticate before trying to search")
            }
            let params = {
                searchedValues: JSON.stringify(searchedValues),
                page: 1,
                start: 0,
                limit: 999999
            };

            request.get({
                url: this.getSearchURL(),
                qs: params,
                useQueryString: true,
            jar: this.cookieJar
            }, (error, response, body) => {
                resolve(JSON.parse(body).data)
            })
        })
    }
}
