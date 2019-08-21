"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userModel_1 = require("../models/userModel");
var groupModel_1 = require("../models/groupModel");
var _helper = /** @class */ (function () {
    function _helper() {
    }
    /**
     * check if the group exist
     * @param group
     */
    _helper.isGroupValid = function (group) {
        var ret = null;
        groupModel_1.Group.findById(group, function (err, group) {
            if (err) {
                ret = false;
            }
            else {
                ret = !!group;
            }
        });
        return new Promise(function (resolve) {
            function checkFlag() {
                if (ret != null) {
                    resolve(ret);
                }
                else {
                    setTimeout(checkFlag, 100);
                }
            }
            checkFlag();
        });
    };
    /**
     * check a given array with ids for all activated leader accounts
     * @return Promise with UserID Array
     * @param leaderIDs
     */
    _helper.getActiveLeadersByArray = function (leaderIDs) {
        var resultLeader = [];
        var i = 0;
        if (leaderIDs != undefined) {
            leaderIDs.forEach(function (id) {
                i++;
                userModel_1.User.findById(id).then(function (user) {
                    if (user && user.role == 'leader' && user.accountStatus.activated == true) {
                        resultLeader.push(user._id);
                    }
                });
            });
            return new Promise(function (resolve) {
                function checkFlag() {
                    if (i == leaderIDs.length) {
                        resolve(resultLeader);
                    }
                    else {
                        setTimeout(checkFlag, 100);
                    }
                }
                checkFlag();
            });
        }
        else {
            return Promise.resolve(null);
        }
    };
    /**
     * check the format of the given endDate and check if start<=end
     * @return endDate
     * @param startDate
     * @param endDate
     */
    _helper.checkEndDate = function (startDate, endDate) {
        var end = new Date(endDate);
        if (end != null && startDate <= end) {
            return end;
        }
        return null;
    };
    _helper.matchEmailRegex = function (text) {
        var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/g;
        // console.log("matchEmailRegex: " + text);
        var emails = text.match(emailRegex);
        // console.log(emails);
        if (emails == null) {
            return [];
        }
        return emails;
    };
    return _helper;
}());
exports._helper = _helper;
//# sourceMappingURL=_helper.js.map