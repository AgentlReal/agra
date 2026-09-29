import mysql, { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

async function cleanDatabase() {
    let connection;
    const isTruncateOnly = process.argv.includes("--truncate");

    try {
        if (!process.env.DB_NAME) {
            throw new Error("DB_NAME tidak ditemukan di environment variables (.env).");
        }

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
        });

        console.log(`Terhubung ke database: ${process.env.DB_NAME}`);
        console.log(
            isTruncateOnly
                ? "Mode: Mengosongkan data tabel (TRUNCATE)..."
                : "Mode: Menghapus semua tabel (DROP TABLE)..."
        );

        // Ambil seluruh daftar tabel yang ada di schema
        const [rows] = await connection.query<RowDataPacket[]>(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
            [process.env.DB_NAME]
        );

        if (rows.length === 0) {
            console.log("Database sudah kosong, tidak ada tabel yang ditemukan.");
            return;
        }

        // Matikan sementara foreign key check agar relasi tidak menyebabkan error saat penghapusan
        await connection.query("SET FOREIGN_KEY_CHECKS = 0;");

        for (const row of rows) {
            const tableName = row.TABLE_NAME || row.table_name;
            if (isTruncateOnly) {
                console.log(`Mengosongkan data tabel: ${tableName}`);
                await connection.query(`TRUNCATE TABLE \`${tableName}\`;`);
            } else {
                console.log(`Menghapus tabel: ${tableName}`);
                await connection.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
            }
        }

        // Aktifkan kembali foreign key check
        await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

        console.log(
            isTruncateOnly
                ? `Berhasil mengosongkan isi dari ${rows.length} tabel.`
                : `Berhasil menghapus seluruh (${rows.length}) tabel dari database.`
        );
    } catch (error) {
        console.error("Terjadi kesalahan saat membersihkan database:", error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

cleanDatabase();
