import { exit } from "node:process";
import { db } from "../config/db";

const clearData = async () => {
  console.log("Clearing data...", process.argv[2]);
  try {
    await db.sync({ force: true });
    console.log("Data cleared");
    exit(0);
  } catch (error) {
    exit(1);
  }
};

if (process.argv[2] === "clear") {
  clearData();
}
