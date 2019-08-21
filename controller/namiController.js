var errors_1 = require("../errors");
var config_1 = require("./../config");
var mailController_1 = require("./mailController");
var apiClient = require('request');
(function (Status) {
    //connection hasn't started
    Status[Status["IDLE"] = 1] = "IDLE";
    //authentication has started
    Status[Status["AUTH"] = 2] = "AUTH";
    // client is connected
    Status[Status["CONNECTED"] = 3] = "CONNECTED";
    // an error occurred
    Status[Status["ERROR"] = 99] = "ERROR";
})(exports.Status || (exports.Status = {}));
var Status = exports.Status;
/**
 * Promise based Class for communication with DPSG Namentliche Mitgliedermeldung
 */
var NamiAPI = (function () {
    //contains the untergliederungId for the search request
    function NamiAPI(loginName, password, groupId) {
        apiClient.defaults({ jar: true });
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
    NamiAPI.prototype.startSession = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //do not start a new session if one is already in progress
            if (_this.status === Status.CONNECTED) {
                resolve(true);
                return;
            }
            if (_this.status === Status.AUTH) {
                console.warn("Auth Cancelled: Current Nami Status is AUTH");
                resolve(false);
                return;
            }
            _this.status = Status.AUTH;
            apiClient.post({
                url: _this.host + _this.authURL,
                jar: _this.cookieJar,
                form: {
                    username: _this.loginName,
                    password: _this.password,
                    Login: "API",
                    redirectTo: "./pages/loggedin.jsp"
                }
            }, function (error, response, body) {
                if (error) {
                    _this.status = Status.ERROR;
                    reject(error);
                    return;
                }
                if (response.statusCode === 302) {
                    apiClient.get({
                        url: response.headers.location,
                        jar: _this.cookieJar
                    }, function (error2, response2, body2) {
                        if (error2) {
                            _this.status = Status.ERROR;
                            reject(error);
                            return;
                        }
                        if (response2.statusCode !== 200) {
                            _this.status = Status.ERROR;
                            reject("AUTH Error: status code != 200 (in second response). Response:\n" + JSON.stringify(response2.toJSON()));
                            return;
                        }
                        console.log("Successfully connected to Nami");
                        _this.status = Status.CONNECTED;
                        body2 = JSON.parse(body2);
                        _this.apiMajor = body2.majorNumber;
                        _this.apiMinor = body2.minorNumber;
                        resolve(true);
                    });
                }
                else {
                    _this.status = Status.ERROR;
                    try {
                        body = JSON.parse(body);
                    }
                    catch (err) {
                        reject("AUTH Error: status code != 302. Response:\n" + JSON.stringify(response.toJSON()));
                    }
                    reject(body.statusMessage);
                }
            });
        });
    };
    NamiAPI.nami = new NamiAPI(config_1.Config.nami.user, config_1.Config.nami.pass, config_1.Config.nami.gruppierung);
    /**
     * return a list of all members
     * @param request
     * @param response
     * @param next
     */
    NamiAPI.async = getAllMemberForGroup(request, response, next);
    return NamiAPI;
})();
exports.NamiAPI = NamiAPI;
{
    try {
        response.status(200).json(await, NamiAPI.getAllMembers(request.query.filterString));
    }
    catch (e) {
        response.status(400);
    }
}
async;
getOneMemberFromGroupById(request, response, next);
{
    try {
        response.status(200).json(await, NamiAPI.getOneMember(request.params.id));
    }
    catch (e) {
        response.status(400);
    }
}
async;
getEmailsByFilter(request, response, next);
{
    try {
        var emailArray = await, NamiAPI_1, getAllEmailsByFilter = (request.query.filter);
        // @ts-ignore
        response.status(200).json({ list: emailArray.map(function (email) { return email.email; }).join(','), objects: emailArray });
    }
    catch (e) {
        response.status(400);
    }
}
getAllMembers(filterString, string = null);
{
    return new Promise(function (resolve) {
        NamiAPI.nami.startSession().then(function () {
            if (NamiAPI.nami.status !== Status.CONNECTED) {
                throw new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Nami: Authenticate before trying to search");
            }
            var params = {
                page: 1,
                start: 0,
                limit: 999999
            };
            var query = "";
            if (filterString) {
                query = '?filterString=' + filterString;
            }
            apiClient.get({
                url: NamiAPI.nami.host + "/ica/rest/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/" + NamiAPI.nami.groupId + query,
                qs: params,
                useQueryString: true,
                jar: NamiAPI.nami.cookieJar
            }, function (error, namiResponse, body) {
                resolve(JSON.parse(body).data);
            });
        }, function (error) {
            throw new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
        });
    });
}
getOneMember(memberId, string);
{
    return new Promise(function (resolve, reject) {
        NamiAPI.nami.startSession().then(function () {
            if (NamiAPI.nami.status !== Status.CONNECTED) {
                throw new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Nami: Authenticate before trying to search");
            }
            var params = {
                page: 1,
                start: 0,
                limit: 999999
            };
            apiClient.get({
                url: NamiAPI.nami.host + "/ica/rest/api/" + NamiAPI.nami.apiMajor + "/" + NamiAPI.nami.apiMinor + "/service/nami/mitglied/filtered-for-navigation/gruppierung/gruppierung/" + NamiAPI.nami.groupId + "/" + memberId,
                qs: params,
                useQueryString: true,
                jar: NamiAPI.nami.cookieJar
            }, function (error, namiResponse, body) {
                resolve(JSON.parse(body).data);
            });
        }, function (error) {
            throw new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "Nami Anmeldung fehlgeschlagen. Fehler: " + error);
        });
    });
}
async;
getAllEmailsById(memberId, string);
Promise < { childName: string, familyName: string, emailSource: mailController_1.EmailSource, email: string }[] > {
    let: emails = [],
    let: member = await, NamiAPI: .getOneMember(memberId),
    if: function (member) {
        if (member === void 0) { member = ['email']; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiMember,
            email: member['vorname'] + " " + member['nachname'] + " <" + member['email'] + ">"
        });
    },
    if: function (member) {
        if (member === void 0) { member = ['emailVertretungsberechtigter']; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiVertretungsberechtigter,
            email: "Fam. " + member['nachname'] + " <" + member['emailVertretungsberechtigter'] + ">"
        });
    },
    //hint it is possible to save text/email in telefax or telefon
    if: function (_helper, matchEmailRegex) {
        if (matchEmailRegex === void 0) { matchEmailRegex = (member['telefax']).length; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiSonstige,
            email: member['telefax']
        });
    }, if: function (_helper, matchEmailRegex) {
        if (matchEmailRegex === void 0) { matchEmailRegex = (member['telefon3']).length; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiSonstige,
            email: member['telefon3']
        });
    }, if: function (_helper, matchEmailRegex) {
        if (matchEmailRegex === void 0) { matchEmailRegex = (member['telefon2']).length; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiSonstige,
            email: member['telefon2']
        });
    }, if: function (_helper, matchEmailRegex) {
        if (matchEmailRegex === void 0) { matchEmailRegex = (member['telefon1']).length; }
        emails.push({
            childName: member['vorname'],
            familyName: member['nachname'],
            emailSource: mailController_1.EmailSource.NamiSonstige,
            email: member['telefon1']
        });
    },
    return: emails
};
getAllEmailsByFilter(filter, string = null);
Promise < { childName: string, familyName: string, emailSource: mailController_1.EmailSource, email: string }[] > {
    return: new Promise(function (resolve) {
        var emails = [];
        NamiAPI.getAllMembers(filter).then(async(data), {
            // @ts-ignore
            for: function (let) { }, i: function () { }, i: ++ });
        {
            // @ts-ignore
            console.log('Email-Adressen werden geladen: ' + Math.round((i + 1) / data.length * 100) + '%');
            emails = emails.concat(await, NamiAPI.getAllEmailsById(data[i]['id']));
        }
        resolve(emails);
    })
};
;
//# sourceMappingURL=namiController.js.map