import { Service } from "node-windows";
var svc = new Service({
  name:'StevesBot',
  description: 'Steve\'s Bot',
  script: '../dist/index.js',
});
svc.on('stop',function(){
  console.log('Stop complete.');
});
svc.stop();