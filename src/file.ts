import fs from "fs";
import path from "path";
export const getAllFiles = (folderPath: string): string[] => {
  const response: string[] = [];
  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const name = `${folderPath}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      if (file === ".git" || file === "node_modules") return [];
      response.push(...getAllFiles(name));
    } else {
      response.push(name);
    }
  });
  return response;
};
