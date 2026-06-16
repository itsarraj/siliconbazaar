import { execSync } from "node:child_process";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

if (!process.env.DATABASE_URL) {
  console.error(`
[netlify-build] Missing DATABASE_URL.

Add environment variables in Netlify:
  Site configuration → Environment variables → Add a variable

Required at minimum:
  DATABASE_URL = your Neon pooler URL
  NODE_ENV = production
  SECRET = your JWT secret
  PRODUCTION_CLIENT_ORIGIN = https://siliconbazaar.vercel.app
  API_PUBLIC_URL = https://siliconbazaar.netlify.app

Copy values from backend/.env, then redeploy.
`);
  process.exit(1);
}

run("npm ci");
run("npx prisma generate");
run("npm run build");

// DB was bootstrapped locally (db push / manual migrations). Netlify builds should not
// mutate production schema — avoids Prisma P3005 on non-empty databases.
if (process.env.NETLIFY) {
  console.log(
    "[netlify-build] Skipping prisma migrate deploy on Netlify. " +
      "Apply new migrations locally with: npx prisma migrate deploy"
  );
} else {
  run("npx prisma migrate deploy");
}
