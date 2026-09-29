import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

async function runMigrations() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
        });

        console.log("Memulai proses database migration...");

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

        console.log(`Berhasil mengeksekusi ${count} file migrasi.`);
    } catch (error) {
        console.error("Terjadi kesalahan saat migrasi:", error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigrations();

