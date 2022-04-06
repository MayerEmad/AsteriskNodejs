

// // netstat tcp asterisk
// //ami
// // maneger.conf
// // ari
// // http.conf  ari.conf

// /*
// var ari = require('ari-client');
// ari.connect('http://127.0.0.1:8088', 'mayer', 'mayer')
//   .then(function (client) {})
//   .catch(function (err) {});

// ari.bridges.list(function (err, bridges) {});
// //ari.bridges.get({bridgeId: 'uniqueid'}, function (err, bridge) {});

// var channel = ari.Channel();
// channel.on('StasisStart', function (event, channel) {});
// channel.on('ChannelDtmfReceived', function (event, channel) {});
// channel.originate({endpoint: 'SIP/1000', app: 'application', appArgs: 'dialed'})
//   .then(function (channel) {})
//   .catch(function (err) {});
// */



// 'use strict';

// var ari = require('ari-client');
// var util = require('util');

// ari.connect('http://localhost:8088', 'mayer', 'mayer', clientLoaded);

// // handler for client being loaded
// function clientLoaded (err, client) {
//   if (err) {
//     throw err;
//   }


// /*
//   var channel = client.Channel();
//   channel.on('StasisStart', function (event, channel) {});
//   channel.on('ChannelDtmfReceived', function (event, channel) {});
//   channel.originate({endpoint: 'PJSIP/1000', app: 'application', appArgs: 'dialed'})
//     .then(function (channel) {
//       console.log('sip 1000 channel');
//     })
//     .catch(function (err) {
//       console.log('sip 1000 error');
//     });
// */


//   client.channels.list(function(err, channels) {
//     if (!channels.length) {
//       console.log('No channels currently :-(');
//     } else {
//       console.log('Current channels:');
//       channels.forEach(function(channel) {
//         console.log(channel.name);
//       });
//     }
//   });

//   // handler for StasisStart event
//   function stasisStart(event, channel) {
//     console.log(util.format(
//         'Channel %s has entered the application', channel.name));

//     // use keys on event since channel will also contain channel operations
//     Object.keys(event.channel).forEach(function(key) {
//       console.log(util.format('%s: %s', key, JSON.stringify(channel[key])));
//     });
//   }

//   // handler for StasisEnd event
//   function stasisEnd(event, channel) {
//     console.log(util.format(
//         'Channel %s has left the application', channel.name));
//   }

//   client.on('StasisStart', stasisStart);
//   client.on('StasisEnd', stasisEnd);

//   client.start('channel-dump');
  
// }


//global files 
const path = require('path');

//third party
const express=require('express');
const bodyParser = require('body-parser');

//custom files need path
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app=express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);




