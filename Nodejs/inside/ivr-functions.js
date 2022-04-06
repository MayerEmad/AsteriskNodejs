
function one(channel) {
    console.log('Call from extension %s ', channel.dialplan.exten);
    console.log('execute bridge dial');
    require('child_process').fork('bridge-dial.js',['SIP/mayer2']);

    channel.continueInDialplan({
      channelId: channel.id,
      extension: 1007 //300
  }).then(function () {})
    .catch(function (err) {});
   
}
function two(channel) {
      
    channel.play({media: 'sound:hello'}, function(err) {
        if (err) {
          throw err;
        } 
      });

      require('child_process').fork('bridge-move.js',['SIP/mayer2']);
      channel.continueInDialplan({
        channelId: channel.id,
        extension: 1008 //300
    }).then(function () {})
      .catch(function (err) {});
}
module.exports = {one,two};