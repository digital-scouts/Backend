import {GroupLesson} from "../models/groupLessonModel";
import {User} from "../models/userModel";

export class _helper {

    /**
     * check if the group exist
     * @param group
     */
    static isGroupValid(group: string): boolean {
        return GroupLesson.findById(group).then(group => {
            return !!group;
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
                    if (user) {
                        if (user.role == 'leader' && user.accountStatus.activated == true) {
                            resultLeader.push(user._id)
                        }
                    } else {
                        //user did not exist
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
