import {Config} from "./../config";

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

let apiClient = require('request');

export class HolidayController {

    static vacationPath = "https://ferien-api.de/api/v1/holidays/";
    static holidayPath = "https://feiertage-api.de/api";

    static holidayState = Config.calender.holidayState;

    constructor() {
    }

    /**
     * check if the date is a holiday or a vacation
     * @param request
     * @param response
     * @param next
     */
    public static async isDateHolidayOrVacation(request, response, next) {
        const date = request.query.date;
        if(await HolidayController.isDateHoliday(date) || await HolidayController.isDateVacation(date)){
            response.status(200).json(true);
        }else{
            response.status(200).json(false);
        }
    }

    /**
     * check if the date is a holiday
     * @param date
     */
    private static async isDateHoliday(date: string): Promise<boolean> {
        const holidays = await HolidayController.getHolidayForYear(moment(date).year());
        return holidays.includes(date);
    }

    /**
     * check if the current date is in a vacation timespan
     * @param date
     */
    private static async isDateVacation(date: string): Promise<boolean> {
        const vacations = await HolidayController.getVacationForYear(moment(date).year());
        for (let i = 0; i < vacations.length; i++) {
            const range = moment().range(moment(vacations[i].start,"YYYY-MM-DD"), moment(vacations[i].end,"YYYY-MM-DD"));
            if (range.contains(moment(date, "YYYY-MM-DD"))) {
                return true;
            }
        }
        return false;
    }

    /**
     * return a list of all holidays (Feiertage) without name for one year (default is current year)
     * @param year
     */
    private static getHolidayForYear(year: number = moment().year()): Promise<string[]> {
        const holidays = [];
        return new Promise((resolve, reject) => {
            apiClient.get({
                url: HolidayController.holidayPath + '?jahr=' + year + '&nur_land=' + HolidayController.holidayState,
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(response.statusCode);
                    return;
                }
                body = JSON.parse(body);
                for (const x in Object.keys(body)) {
                    const key = Object.keys(body)[x];
                    holidays.push(body[key]['datum']);
                }
                resolve(holidays);
            });
        });
    }

    /**
     * return a list for all Vacation (Ferien) without name for one year (default is current year)
     * @param year
     */
    private static getVacationForYear(year: number = moment().year()): Promise<Array<{ start: string, end: string }>> {
        const vacations = [];
        return new Promise((resolve, reject) => {
            apiClient.get({
                url: HolidayController.vacationPath + HolidayController.holidayState + '/' + year,
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(response.statusCode);
                    return;
                }
                body = JSON.parse(body);
                for (let i = 0; i < body.length; i++) {
                    vacations.push({start: body[i]['start'].split('T')[0], end: body[i]['end'].split('T')[0]});
                }
                resolve(vacations);
            });
        });
    }

}
