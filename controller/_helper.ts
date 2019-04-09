import {GroupLesson} from "../models/groupLessonModel";
import {User} from "../models/userModel";
import {Group} from "../models/groupModel";

export class _helper {

    /**
     * check if the group exist
     * @param group
     */
    static isGroupValid(group: string) {
        let ret = null;

        Group.findById(group).then(group => {
            ret = !!group;
        });

        return new Promise(resolve => {
            function checkFlag() {
                if (ret != null) {
                    resolve(ret);
                } else {
                    setTimeout(checkFlag, 100);
                }
            }

            checkFlag();
        });
    }

    /**
     * check a given array with ids for all activated leader accounts
     * @return Promise with UserID Array
     * @param leaderIDs
     */
    public static getActiveLeadersByArray(leaderIDs: string[]) {
        let resultLeader = [];
        let i = 0;
        if (leaderIDs != undefined) {
            leaderIDs.forEach(id => {
                i++;
                User.findById(id).then(user => {
                    if (user && user.role == 'leader' && user.accountStatus.activated == true) {
                        resultLeader.push(user._id)
                    }
                });
            });

            return new Promise(resolve => {
                function checkFlag() {
                    if (i == leaderIDs.length) {
                        resolve(resultLeader);
                    } else {
                        setTimeout(checkFlag, 100);
                    }
                }

                checkFlag();
            });
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * check the format of the given endDate and check if start<=end
     * @return endDate
     * @param startDate
     * @param endDate
     */
    public static checkEndDate(startDate: Date, endDate: string): Date {
        let end = new Date(endDate);

        if (end != null && startDate <= end) {
            return end;
        }

        return null;
    }
}
