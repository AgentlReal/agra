import { hashPassword } from "better-auth/crypto";

const password = process.argv[2];

if (!password) {
  console.error('Pemakaian: npx tsx scripts/hash-password.ts "PasswordBaru"');
  process.exit(1);
}

hashPassword(password).then((hash) => console.log(hash));
