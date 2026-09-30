export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly details?: unknown;

    constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details?: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Permintaan tidak valid", code = "BAD_REQUEST", details?: unknown) {
        super(message, 400, code, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Autentikasi diperlukan", code = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Akses ditolak", code = "FORBIDDEN") {
        super(message, 403, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Data tidak ditemukan", code = "NOT_FOUND") {
        super(message, 404, code);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Terjadi konflik data", code = "CONFLICT") {
        super(message, 409, code);
    }
}

export class ValidationError extends AppError {
    constructor(
        message = "Data yang dikirim tidak valid.",
        fields?: Record<string, string>,
        statusCode = 422,
        code = "VALIDATION_ERROR"
    ) {
        super(message, statusCode, code, fields);
    }
}
