 /*jshint node:true*/
 'use strict';
 
 var ari = require('ari-client');
 var util = require('util');
 var colors=require('colors');
  colors.setTheme({
    info: 'cyan',
    appcolor: 'bgGreen',
    warn: 'yellow',
    success: 'green',
    error: 'red'
    }); 
  
 // ensure endpoint was passed in to script
 if (!process.argv[2]) {
   console.error('usage: node bridge-move.js endpoint');
   process.exit(1);
 }
 ari.connect('http://localhost:8088', 'mayer', 'mayer', clientLoaded);
  
 // handler for client being loaded
 function clientLoaded (err, client) {
   if (err) {
     throw err;
   }
  
   // handler for StasisStart event
   function stasisStart(event, channel) {
     // ensure the channel is not a dialed channel
     var dialed = event.args[0] === 'dialed';
  
     if (!dialed) {
       channel.answer(function(err) {
         if (err) {
           throw err;
         }
  
         console.log('Channel %s has entered our application', channel.name);
  
         findOrCreateHoldingBridge(channel);
       });
     }
   }
  
   function findOrCreateHoldingBridge(channel) {
     console.log('myc FCHBChannel %s'.blue, channel.name);
     client.bridges.list(function(err, bridges) {
       var holdingBridge = bridges.filter(function(candidate) {
         return candidate.bridge_type === 'holding';
       })[0];
  
       if (holdingBridge) {
         console.log('Using existing holding bridge %s by channel %s', holdingBridge.id,channel.name);
  
         originate(channel, holdingBridge);
       } else {
         client.bridges.create({type: 'holding'}, function(err, holdingBridge) {
           if (err) {
             throw err;
           }
  
           console.log('Created new holding bridge %s by channel %s', holdingBridge.id,channel.name);
  
           originate(channel, holdingBridge);
         });
       }
     });
   }
  
   function originate(channel, holdingBridge) {
     holdingBridge.addChannel({channel: channel.id}, function(err) {
       if (err) {
         throw err;
       }
     console.log('myc added to HoldBridge %s'.blue, channel.name);

       
       holdingBridge.startMoh(function(err) {
         // ignore error
       });
     });
  
     var dialed = client.Channel();
  
     channel.on('StasisEnd', function(event, channel) {
       safeHangup(dialed);
     });
  
     dialed.on('ChannelDestroyed', function(event, dialed) {
       safeHangup(channel);
     });
  
     dialed.on('StasisStart', function(event, dialed) {
       joinMixingBridge(channel, dialed, holdingBridge);
     });
  
     dialed.originate(
       {endpoint: process.argv[2], app: 'bridge-move', appArgs: 'dialed'},
       function(err, dialed) {
         if (err) {
           throw err;
         }
     });
   }
  
   // safely hangs the given channel
   function safeHangup(channel) {
     console.log('Hanging up channel %s', channel.name);
  
     channel.hangup(function(err) {
       // ignore error
     });
   }
  
   // handler for dialed channel entering Stasis
   function joinMixingBridge(channel, dialed, holdingBridge) {
     var mixingBridge = client.Bridge();
  
     dialed.on('StasisEnd', function(event, dialed) {
       dialedExit(dialed, mixingBridge);
     });
  
     dialed.answer(function(err) {
       if (err) {
         throw err;
       }
     });
  
     mixingBridge.create({type: 'mixing'}, function(err, mixingBridge) {
       if (err) {
         throw err;
       }
  
       console.log('Created mixing bridge %s', mixingBridge.id);
  
       moveToMixingBridge(channel, dialed, mixingBridge, holdingBridge);
     });
   }
  
   // handler for the dialed channel leaving Stasis
   function dialedExit(dialed, mixingBridge) {
     console.log(
       'Dialed channel %s has left our application, destroying mixing bridge %s'.yellow,
       dialed.name, mixingBridge.id);
  
     mixingBridge.destroy(function(err) {
       if (err) {
         throw err;
       }
     });
     ari.bridges.get({bridgeId: 'uniqueid'}, function (err, bridge) {});
   }
  
   // handler for new mixing bridge ready for channels to be added to it
   function moveToMixingBridge(channel, dialed, mixingBridge, holdingBridge) {
     console.log('Adding channel %s and dialed channel %s to bridge %s',
         channel.name, dialed.name, mixingBridge.id);
  
     holdingBridge.removeChannel({channel: channel.id}, function(err) {
       if (err) {
         throw err;
       }
  
       mixingBridge.addChannel(
           {channel: [channel.id, dialed.id]}, function(err) {
         if (err) {
           throw err;
         }
       });
     });
   }
  
   client.on('StasisStart', stasisStart);
  
   client.start('bridge-move');
 }