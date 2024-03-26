export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class AlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyExistsError";
    }

}

export class LoginError extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginError";
    }
}

export class CorsError extends Error {
    constructor(message) {
        super(message);
        this.name = "CorsError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}