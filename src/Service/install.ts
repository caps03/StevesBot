import { Service } from "node-windows";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
var svc = new Service({
  name: "StevesBot",
  description: "Steve's Bot",
  script: "C:\\Users\\sec02\\source\\repos\\StevesBot\\dist\\index.js",
});
svc.logOnAs.domain = Config.User.Domain;
svc.logOnAs.account = Config.User.Account;
svc.logOnAs.password = Config.User.Password;
svc.on("install", function () {
  console.log("Install complete.");
});
svc.install();
