import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed:", error);
  process.exit(1);
}