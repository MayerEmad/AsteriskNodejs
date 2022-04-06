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
  console.error('usage: node bridge-dial.js endpoint'.error);
  process.exit(1);
}
 
ari.connect('http://localhost:8088', 'mayer', 'mayer', clientLoaded);
 
// handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }
  //edit
  var timers = {};

  // handler for StasisStart event
  function stasisStart(event, channel) {

    // ensure the channel is not a dialed channel
    var dialed = event.args[0] === 'dialed';
    console.log('myc Channel %s dialed= %s'.info, channel.name ,event.args[0]);

    if (!dialed) {
      channel.answer(function(err) {
        console.log('myc Channel %s is answerd in stistart'.info, channel.name);
        if (err) {
          throw err;
        }
 
        console.log('Channel %s has entered our application' . appcolor, channel.name);
 
        // play pls wait evry 5 seconds edit
        var timer = setInterval(playSound, 5000);
        timers[channel.id] = timer;
        function playSound(){
          var playback = client.Playback();
              channel.play({media: 'sound:pls-wait-connect-call'},
                playback, function(err, playback) {
                  if (err) {
                    throw err;
                  }
              });
        }
 
        originate(channel);
      });
    }
  }
  
  function originate(channel) {
    var dialed = client.Channel();
    
    console.log("myc originate function".blue);

    channel.on('StasisEnd', function(event, channel) {
      hangupDialed(channel, dialed ,event);
    });
 
    dialed.on('ChannelDestroyed', function(event, dialed) {
      hangupOriginal(channel, dialed,event);
    });
 
    dialed.on('StasisStart', function(event, dialed) {
      console.log("dial.onstasistart before join mix".bgMagenta);
      joinMixingBridge(channel, dialed);
    });
 
    dialed.originate(
      {endpoint: process.argv[2], app: 'bridge-dial', appArgs: 'dialed'},
      function(err, dialed) {
        if (err) {
          throw err;
        }
    });
  }
 
  // handler for original channel hanging up so we can gracefully hangup the
  // other end
  function hangupDialed(channel, dialed ,event) {
    console.log(
      'Channel %s left our application, hanging up dialed channel %s'.warn,
      channel.name, dialed.name);
      console.log(event.cause_txt+"".magenta);
 
    // hangup the other end
    dialed.hangup(function(err) {
      // ignore error since dialed channel could have hung up, causing the
      // original channel to exit Stasis
    });
  }
 
  // handler for the dialed channel hanging up so we can gracefully hangup the
  // other end
  function hangupOriginal(channel, dialed ,event) {
    console.log('Dialed channel %s has been hung up, hanging up channel %s'.warn,
      dialed.name, channel.name);
 
    // hangup the other end
    channel.hangup(function(err) {
      // ignore error since original channel could have hung up, causing the
      // dialed channel to exit Stasis
    });
  }
 
  // handler for dialed channel entering Stasis
  function joinMixingBridge(channel, dialed) {
    console.log('myc joinMixingBridge means dialed.Stasistart called'.blue);

    var bridge = client.Bridge();
 
    dialed.on('StasisEnd', function(event, dialed) {
      dialedExit(dialed, bridge);
    });
 
    dialed.answer(function(err) {
      console.log('myc Channel %s is answerd'.info, dialed.name);
      if (err) {
        throw err;
      }
      // edit
      var timer = timers[channel.id];
      if (timer) {
        clearTimeout(timer);
        delete timers[channel.id];
      }
    
    });
 
    bridge.create({type: 'mixing'}, function(err, bridge) {
      if (err) {
        throw err;
      }
 
      console.log('Created bridge %s'.success, bridge.id);
 
      addChannelsToBridge(channel, dialed, bridge);
    });
  }
 
  // handler for the dialed channel leaving Stasis
  function dialedExit(dialed, bridge) {
    console.log(
        'Dialed channel %s has left our application, destroying bridge %s'.warn,
        dialed.name, bridge.id);
 
    bridge.destroy(function(err) {
      if (err) {
        throw err;
      }
    });
  }
 
  // handler for new mixing bridge ready for channels to be added to it
  function addChannelsToBridge(channel, dialed, bridge) {
    console.log('Adding channel %s and dialed channel %s to bridge %s'.success,
        channel.name, dialed.name, bridge.id);
 
    bridge.addChannel({channel: [channel.id, dialed.id]}, function(err) {
      if (err) {
        throw err;
      }
    });
  }
 
  client.on('StasisStart', stasisStart);
 
  client.start('bridge-dial');
}

// when caller       close stasiEnd        happens
// when dialed phone close Channelestroyed happens
// if we created bridge then use dial stasiEnd to destroy the bridge