"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./../config");
var Moment = require('moment');
var MomentRange = require('moment-range');
var moment = MomentRange.extendMoment(Moment);
var apiClient = require('request');
var HolidayController = /** @class */ (function () {
    function HolidayController() {
    }
    /**
     * check if the date is a holiday or a vacation
     * @param date
     */
    HolidayController.isDateHolidayOrVacation = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, HolidayController.isDateHoliday(date)];
                    case 1:
                        _a = (_b.sent());
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, HolidayController.isDateVacation(date)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    /**
     * check if the date is a holiday
     * @param date
     */
    HolidayController.isDateHoliday = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var holidays;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HolidayController.getHolidayForYear(moment(date).year())];
                    case 1:
                        holidays = _a.sent();
                        return [2 /*return*/, holidays.includes(date)];
                }
            });
        });
    };
    /**
     * check if the current date is in a vacation timespan
     * @param date
     */
    HolidayController.isDateVacation = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var vacations, i, range;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HolidayController.getVacationForYear(moment(date).year())];
                    case 1:
                        vacations = _a.sent();
                        for (i = 0; i < vacations.length; i++) {
                            range = moment().range(moment(vacations[i].start, "YYYY-MM-DD"), moment(vacations[i].end, "YYYY-MM-DD"));
                            if (range.contains(moment(date, "YYYY-MM-DD"))) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * return a list of all holidays (Feiertage) without name for one year (default is current year)
     * @param year
     */
    HolidayController.getHolidayForYear = function (year) {
        if (year === void 0) { year = moment().year(); }
        var holidays = [];
        return new Promise(function (resolve, reject) {
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
        });
    };
    /**
     * return a list for all Vacation (Ferien) without name for one year (default is current year)
     * @param year
     */
    HolidayController.getVacationForYear = function (year) {
        if (year === void 0) { year = moment().year(); }
        var vacations = [];
        return new Promise(function (resolve, reject) {
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
        });
    };
    HolidayController.vacationPath = "https://ferien-api.de/api/v1/holidays/";
    HolidayController.holidayPath = "https://feiertage-api.de/api";
    HolidayController.holidayState = config_1.Config.calender.holidayState;
    return HolidayController;
}());
exports.HolidayController = HolidayController;
//# sourceMappingURL=holidayController.js.map