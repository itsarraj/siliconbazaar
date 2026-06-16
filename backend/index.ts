import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 9002;
const MODE = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`);
});
