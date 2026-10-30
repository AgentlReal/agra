export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogContext {
    userId?: string;
    requestId?: string;
    route?: string;
    method?: string;
    [key: string]: unknown;
}

export interface StructuredLogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name?: string;
        message: string;
        stack?: string;
        code?: string | number;
    };
}

class Logger {
    private formatLog(
        level: LogLevel,
        message: string,
        context?: LogContext,
        error?: unknown
    ): StructuredLogEntry {
        const entry: StructuredLogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
        };

        if (context && Object.keys(context).length > 0) {
            entry.context = context;
        }

        if (error) {
            if (error instanceof Error) {
                entry.error = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    code: (error as { code?: string | number }).code,
                };
            } else if (typeof error === "string") {
                entry.error = { message: error };
            } else {
                entry.error = { message: String(error) };
            }
        }

        return entry;
    }

    private emit(entry: StructuredLogEntry): void {
        const json = JSON.stringify(entry);
        if (entry.level === "ERROR") {
            console.error(json);
        } else if (entry.level === "WARN") {
            console.warn(json);
        } else {
            console.info(json);
        }
    }

    info(message: string, context?: LogContext): void {
        this.emit(this.formatLog("INFO", message, context));
    }

    warn(message: string, context?: LogContext, error?: unknown): void {
        this.emit(this.formatLog("WARN", message, context, error));
    }

    error(message: string, error?: unknown, context?: LogContext): void {
        this.emit(this.formatLog("ERROR", message, context, error));
    }
}

export const logger = new Logger();

