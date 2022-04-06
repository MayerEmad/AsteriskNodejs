
// require('child_process').execSync(
//     'asterisk -rvvv',
//     {stdio: 'inherit'}
// );

require('child_process').execSync(
    'ls',
    {stdio: 'inherit'}
);


// const { spawn } = require("child_process");
// const ls = spawn("asterisk", ["-rvvv"]);

// ls.stdout.on("data", data => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
//     console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });


