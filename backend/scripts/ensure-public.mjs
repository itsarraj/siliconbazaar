import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const indexPath = path.join(publicDir, "index.html");

const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SiliconBazaar API</title>
  </head>
  <body>
    <p>SiliconBazaar API — use /api routes.</p>
  </body>
</html>
`;

fs.mkdirSync(publicDir, { recursive: true });

if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, fallbackHtml, "utf8");
}
