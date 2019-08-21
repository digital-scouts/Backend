var config_1 = require("./../config");
var Moment = require('moment');
var MomentRange = require('moment-range');
var moment = MomentRange.extendMoment(Moment);
var apiClient = require('request');
var HolidayController = (function () {
    function HolidayController() {
    }
    HolidayController.vacationPath = "https://ferien-api.de/api/v1/holidays/";
    HolidayController.holidayPath = "https://feiertage-api.de/api";
    HolidayController.holidayState = config_1.Config.calender.holidayState;
    /**
     * check if the date is a holiday or a vacation
     * @param date
     */
    HolidayController.async = isDateHolidayOrVacation(date, string);
    return HolidayController;
})();
exports.HolidayController = HolidayController;
{
    return await;
    HolidayController.isDateHoliday(date) || await;
    HolidayController.isDateVacation(date);
}
async;
isDateHoliday(date, string);
Promise < boolean > {
    const: holidays = await, HolidayController: .getHolidayForYear(moment(date).year()),
    return: holidays.includes(date)
};
async;
isDateVacation(date, string);
Promise < boolean > {
    const: vacations = await, HolidayController: .getVacationForYear(moment(date).year()),
    for: function (let, i, i) {
        if (let === void 0) { let = i = 0; }
        if (i === void 0) { i = ; }
        if (i === void 0) { i = ++; }
        var range = moment().range(moment(vacations[i].start, "YYYY-MM-DD"), moment(vacations[i].end, "YYYY-MM-DD"));
        if (range.contains(moment(date, "YYYY-MM-DD"))) {
            return true;
        }
    },
    return: false
};
getHolidayForYear(year, number = moment().year());
Promise < string[] > {
    const: holidays = [],
    return: new Promise(function (resolve, reject) {
        apiClient.get({
            url: HolidayController.holidayPath + '?jahr=' + year + '&nur_land=' + HolidayController.holidayState,
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            if (response.statusCode !== 200) {
                reject(response.statusCode);
                return;
            }
            body = JSON.parse(body);
            for (var x in Object.keys(body)) {
                var key = Object.keys(body)[x];
                holidays.push(body[key]['datum']);
            }
            resolve(holidays);
        });
    })
};
getVacationForYear(year, number = moment().year());
Promise < Array < { start: string, end: string } >> {
    const: vacations = [],
    return: new Promise(function (resolve, reject) {
        apiClient.get({
            url: HolidayController.vacationPath + HolidayController.holidayState + '/' + year,
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            if (response.statusCode !== 200) {
                reject(response.statusCode);
                return;
            }
            body = JSON.parse(body);
            for (var i = 0; i < body.length; i++) {
                vacations.push({ start: body[i]['start'].split('T')[0], end: body[i]['end'].split('T')[0] });
            }
            resolve(vacations);
        });
    })
};
//# sourceMappingURL=holidayController.js.map