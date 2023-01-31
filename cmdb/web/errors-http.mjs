import {ERROR_CODES} from '../errors.mjs'

function HttpErrorResponse(status, message, description) {
    this.status = status
    this.body = {
        message: message,
        description: description
    }
}

const HTTP_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

export default function(e) {
    switch(e.code) {
        case ERROR_CODES.INVALID_PARAMETER_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, e.message, e.description)
        case ERROR_CODES.USER_NOT_FOUND_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, e.message, e.description)
        case ERROR_CODES.GROUP_NOT_FOUND_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, e.message, e.description)
        case ERROR_CODES.PERMISSION_DENIED_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, e.message, e.description)
        case ERROR_CODES.MOVIE_NOT_FOUND_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, e.message, e.description)
        case ERROR_CODES.MOVIE_ALREADY_IN_GROUP_CODE: 
                return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, e.message, e.description)
        default: return new HttpErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal error. Contact the developer!")
    }
}