export const Errors = {
    NoContent: {//There is no content to send for this request, but the headers may be useful.
        status: 204,
        message: "The functionality is not implemented yet. Come back later."
    },
    BadRequest: {//This response means that server could not understand the request due to invalid syntax.
        status: 400,
        message: "Request has wrong format."
    },
    Unauthorized: {//Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
        status: 401,
        message: "Authentication credentials not valid."
    },
    Forbidden: {//The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
        status: 403,
        message: "You're missing permission to execute this request."
    },
    NotFound: {//The server can not find requested resource. In the browser, this means the URL is not recognized.
        status: 404,
        message: "Request could not be resolved."
    },
    UnprocessableEntity: {//indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
        status: 422,
        message: "Request is semantically wrong."
    },
    InternalServerError: {//The server has encountered a situation it doesn't know how to handle.
        status: 500,
        message: "An internal server error occurred."
    },
    ServiceUnavailable: {//The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
        status: 503,
        message: "The service is currently not available."
    }
};

export class ErrorREST extends Error {
    public response: { status: number; message: string; detail: string };

    constructor(error: { status: number, message: string }, detail: string = undefined, ...args) {
        super(...args);
        this.response = {status: error.status, message: error.message, detail: detail};
    }
}
