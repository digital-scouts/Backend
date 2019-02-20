/* TODO Add error handling if important request data is missing */
/* TODO Add error handling if the request should fail - e.g. data is not in DB */

const Errors = {
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
    UnprocessableEntity:{
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

class ErrorREST extends Error {
    constructor(type, detail=undefined, ...args) {
        super(...args);

        if(typeof type !== 'object') {
            return new Error("You need to provide the error type.");
        }

        this.response = type;

        if(detail !== undefined) {
            this.response.detail = detail;
        }
    }
}

module.exports = {
    ErrorREST: ErrorREST,
    Errors: Errors
};
