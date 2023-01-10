import { Service } from "node-windows";
var svc = new Service({
  name: "StevesBot",
  description: "Steve's Bot",
  script: "../index.js",
});
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
});
svc.uninstall();
