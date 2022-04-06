/*jshint node: true*/
'use strict';
 
var ari = require('ari-client');
var util = require('util');
 
ari.connect('http://localhost:8088', 'mayer', 'mayer', clientLoaded);
 
// handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }

  // var fs = require('fs')
  // fs.readFile('/etc/asterisk/extensions.conf', 'utf8', function (err,data) {
  //   if (err) {
  //     return console.log(err);
  //   }  
  //   //console.log(data);
  //   var newValue = data+"\n"
  //                      +"exten => 1005,1,NoOp(NodeJs)\n"
  //                      +" same => n,Stasis(channel-playback-monkeys)\n"
  //                      +" same => n,Hangup()\n";
    
  //   fs.writeFile("/etc/asterisk/extensions.conf", newValue, (err) => {
  //     if (err) console.log(err);
      
  //     console.log("Successfully Written to File.");

          client.asterisk.reloadModule({
            moduleName: 'pbx_config.so'
          })
          .then(function () {console.log('reload done');})
          .catch(function (err) {});
  //   });
  // });

  // client.asterisk.listModules()
  // .then(function (modules) {
  //   if (!modules.length) {
  //       console.log('No modules currently :-(');
  //     } else {
  //       console.log('Current modules:');
  //       modules.forEach(function(module) {
  //         console.log(module.name);
  //       });
  //     }
  // })
  // .catch(function (err) {});
}


/**/