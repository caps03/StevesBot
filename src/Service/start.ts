import { Service } from "node-windows";
var svc = new Service({
  name:'StevesBot',
  description: 'Steve\'s Bot',
  script: '../index.js',
});
svc.on('start',function(){
  console.log('Start complete.');
});
svc.start();