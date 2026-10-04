import { NextResponse } from "next/server";
import { AppError } from "../errors/app-error";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        fields?: unknown;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        [key: string]: unknown;
    };
}

export function successResponse<T>(data: T, status = 200, meta?: ApiResponse["meta"]) {
    const payload: ApiResponse<T> = {
        success: true,
        data,
    };
    if (meta) {
        payload.meta = meta;
    }
    return NextResponse.json(payload, { status });
}

export function jsonResponse<T>(data: T, status = 200, headers?: HeadersInit) {
    return NextResponse.json(data, {
        status,
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            ...headers,
        },
    });
}

export function errorResponse(error: unknown, style: "m01" | "status" = "m01") {
    if (error instanceof AppError) {
        if (style === "status") {
            return NextResponse.json(
                {
                    status: error.statusCode,
                    error: error.code,
                    message: error.message,
                },
                { status: error.statusCode }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: error.code,
                    message: error.message,
                    fields: error.details || null,
                },
            },
            { status: error.statusCode }
        );
    }

    console.error("Unhandled Error:", error);
    if (style === "status") {
        return NextResponse.json(
            {
                status: 500,
                error: "INTERNAL_SERVER_ERROR",
                message: "Terjadi kesalahan internal pada server",
            },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Terjadi kesalahan internal pada server",
                fields: null,
            },
        },
        { status: 500 }
    );
}

