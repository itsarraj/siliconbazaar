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
run("npm run build");
