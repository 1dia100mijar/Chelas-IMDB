export const ERROR_CODES = {
    INVALID_PARAMETER_CODE: 1,
    USER_NOT_FOUND_CODE: 2,
    GROUP_NOT_FOUND_CODE: 3,
    PERMISSION_DENIED_CODE: 4,
    MOVIE_NOT_FOUND_CODE: 5,
    MOVIE_ALREADY_IN_GROUP_CODE: 6,
}

export default {
    INVALID_PARAMETER: (argName, description) => {
        return {
            code: ERROR_CODES.INVALID_PARAMETER_CODE,
            message: `Invalid argument ${argName}`,
            description: description
        }
    },
    USER_NOT_FOUND: () => {
        return {
            code: ERROR_CODES.USER_NOT_FOUND_CODE,
            message: `User not found`
        }
    },
    GROUP_NOT_FOUND: (groupId) => {
        return {
            code: ERROR_CODES.GROUP_NOT_FOUND_CODE,
            message: `Group with id ${groupId} not found`
        }
    },
    PERMISSION_DENIED: (groupId) => {
        return {
            code: ERROR_CODES.PERMISSION_DENIED_CODE,
            message: `Permission denied. You dont have permission to make changes to group ${groupId}`
        }
    },
    MOVIE_NOT_FOUND: (groupId, movieId) => {
        return {
            code: ERROR_CODES.MOVIE_NOT_FOUND_CODE,
            message: `Movie with id ${movieId} not found in group with id ${groupId}`
        }
    },
    MOVIE_ALREADY_IN_GROUP: (groupId) => {
        return {
            code: ERROR_CODES.MOVIE_ALREADY_IN_GROUP_CODE,
            message: `Movie already in group with id ${groupId}`
        }
    }
}