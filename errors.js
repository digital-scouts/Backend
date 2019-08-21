var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var ErrorREST = (function (_super) {
    __extends(ErrorREST, _super);
    function ErrorREST(error, detail) {
        if (detail === void 0) { detail = undefined; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        _super.apply(this, args);
        this.response = { status: error.status, message: error.message, detail: detail };
    }
    return ErrorREST;
})(Error);
exports.ErrorREST = ErrorREST;
//# sourceMappingURL=errors.js.map