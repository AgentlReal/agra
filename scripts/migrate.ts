import "dotenv/config";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { auth } from "../src/app/auth";
import { getMigrations } from "better-auth/db/migration";

interface ClosableDatabase {
    end?: () => Promise<void>;
}

async function runBetterAuthMigrations() {
    console.log("=== [1/2] Memeriksa Migrasi Better Auth ===");
    try {
        const m = await getMigrations(auth.options);

        const hasTableChanges = m.toBeCreated.length > 0 || m.toBeAdded.length > 0;
        const hasIndexChanges = m.toBeAddedIndexes.length > 0;

        if (!hasTableChanges && !hasIndexChanges) {
            console.log("✓ Schema Better Auth sudah up-to-date (tidak ada perubahan).");
            return;
        }

        if (m.toBeCreated.length > 0) {
            console.log(
                `Tabel Better Auth yang akan dibuat (${m.toBeCreated.length}):`,
                m.toBeCreated.map((t) => t.table).join(", ")
            );
        }
        if (m.toBeAdded.length > 0) {
            console.log(
                `Kolom yang akan ditambahkan (${m.toBeAdded.length}):`,
                m.toBeAdded.map((t) => t.table).join(", ")
            );
        }
        if (m.toBeAddedIndexes.length > 0) {
            console.log(
                `Index yang akan ditambahkan (${m.toBeAddedIndexes.length}):`,
                m.toBeAddedIndexes.map((i) => i.name).join(", ")
            );
        }

        await m.runMigrations();
        console.log("✓ Berhasil mengeksekusi migrasi schema Better Auth.");
    } catch (error) {
        console.error("Terjadi kesalahan saat migrasi Better Auth:", error);
        throw error;
    } finally {
        const db = auth.options.database as ClosableDatabase | undefined;
        if (db && typeof db.end === "function") {
            await db.end();
        }
    }
}

async function runCustomSqlMigrations() {
    console.log("\n=== [2/2] Memeriksa Migrasi SQL (migrations/) ===");
    let connection;
    try {
        const migrationsDir = path.join(process.cwd(), "migrations");

        if (!fs.existsSync(migrationsDir)) {
            console.warn("Folder migrations tidak ditemukan.");
            return;
        }

        const files = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        if (files.length === 0) {
            console.log("Tidak ada file .sql yang ditemukan di folder migrations.");
            return;
        }

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
        });

        let count = 0;
        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf-8").trim();

            if (sql.length === 0) {
                console.log(`Melewati file kosong: ${file}`);
                continue;
            }

            console.log(`Mengeksekusi: ${file}`);
            await connection.query(sql);
            console.log(`Selesai: ${file}`);
            count++;
        }

        console.log(`✓ Berhasil mengeksekusi ${count} file migrasi SQL.`);
    } catch (error) {
        console.error("Terjadi kesalahan saat migrasi SQL:", error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function runAllMigrations() {
    try {
        console.log("Memulai proses database migration...\n");
        await runBetterAuthMigrations();
        await runCustomSqlMigrations();
        console.log("\nSemua proses migrasi selesai.");
    } catch {
        process.exit(1);
    }
}

runAllMigrations();
