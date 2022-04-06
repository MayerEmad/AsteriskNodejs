fs = require('fs')
const { exec } = require("child_process");
const { spawn } = require("child_process");

/*fs.readFile('/home/memad/test.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }  
  //console.log(data);
  var newValue = data+"\n"+"exten => 1000,1,NoOp()";
  
  fs.writeFileSync('/home/memad/test.txt', newValue, 'utf-8');

  console.log('readFileSync complete');
});*/

/*exec("asterisk -rvvv", (error, stdout, stderr) => {
    if (error) {
        console.log('error asterisk: ${error.message}');
        return;
    }
    if (stderr) {
        console.log('stderr: ${stderr}');
        return;
    }
    console.log('stdout: ${stdout}');
    });
  */
    const ls = spawn("asterisk", ["-rvvv"]);

    ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });  

    const ls2 = spawn("dialplan", ["reload"]);

    ls2.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    ls2.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    ls2.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ls2.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });

    /*exec("dialplan reload", (error, stdout, stderr) => {
        if (error) {
            console.log('error dialplan: ${error.message}');
            return;
        }
        if (stderr) {
            console.log('stderr: ${stderr}');
            return;
        }
        console.log('stdout: ${stdout}');
    });*/
