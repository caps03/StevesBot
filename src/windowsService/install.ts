import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Service } from "node-windows";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
let scriptPath = __dirname.substring(0, __dirname.indexOf("windowsService")) + "\\index.js"
let svc = new Service({
  name: "StevesBot",
  description: "Steve's Bot",
  script: scriptPath
});
svc.logOnAs.domain = Config.User.Domain;
svc.logOnAs.account = Config.User.Account;
svc.logOnAs.password = Config.User.Password;
svc.on("install", function () {
  console.log("Install complete.");
});
svc.install();
