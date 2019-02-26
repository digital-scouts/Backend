export const Errors = {
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

export class ErrorREST extends Error {
    constructor(name: string, detail:string = undefined, ...args) {
        super(...args);
        this.name = name;
        if (detail !== undefined) {
            this.message = detail;
        }
    }
}
