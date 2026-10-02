import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";

let pool: Pool | null = null;

export function getDbPool(): Pool {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            connectTimeout: 10000,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            timezone: "+07:00",
            multipleStatements: false,
            decimalNumbers: true,
            typeCast: (field: any, next: () => any) => {
                if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
                    const val = field.string();
                    return val === null ? null : Number(val);
                }
                return next();
            },
        });
    }
    return pool;
}

export async function query<T extends RowDataPacket[]>(
    sql: string,
    params?: unknown[]
): Promise<T> {
    const p = getDbPool();
    const [rows] = await p.query<T>(sql, params);
    return rows;
}

export async function execute(
    sql: string,
    params?: unknown[]
): Promise<ResultSetHeader> {
    const p = getDbPool();
    const [result] = await p.query<ResultSetHeader>(sql, params);
    return result;
}

export async function withTransaction<T>(
    callback: (conn: PoolConnection) => Promise<T>
): Promise<T> {
    const p = getDbPool();
    const conn = await p.getConnection();
    try {
        await conn.beginTransaction();
        const result = await callback(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}
