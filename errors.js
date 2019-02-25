"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = {
    NoContent: {
        status: 204,
        message: "The functionality is not implemented yet. Come back later."
    },
    BadRequest: {
        status: 400,
        message: "Request has wrong format."
    },
    Unauthorized: {
        status: 401,
        message: "Authentication credentials not valid."
    },
    Forbidden: {
        status: 403,
        message: "You're missing permission to execute this request."
    },
    NotFound: {
        status: 404,
        message: "Request could not be resolved."
    },
    UnprocessableEntity: {
        status: 422,
        message: "Request is semantically wrong."
    },
    InternalServerError: {
        status: 500,
        message: "An internal server error occurred."
    },
    ServiceUnavailable: {
        status: 503,
        message: "The service is currently not available."
    }
};
var ErrorREST = /** @class */ (function (_super) {
    __extends(ErrorREST, _super);
    function ErrorREST(type, detail) {
        if (detail === void 0) { detail = undefined; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var _this = _super.apply(this, args) || this;
        _this.response = type;
        if (detail !== undefined) {
            _this.response.detail = detail;
        }
        return _this;
    }
    return ErrorREST;
}(Error));
exports.ErrorREST = ErrorREST;
