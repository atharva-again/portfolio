import fs from "fs";
import path from "path";

const asciiFilePath = path.join(process.cwd(), "app/components/AtharvaVermaASCII.txt");

export const ATHARVA_ASCII_ART = fs.readFileSync(asciiFilePath, "utf-8");
