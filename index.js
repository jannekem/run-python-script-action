const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const tmp = require('tmp');

async function run() {
    const script = core.getInput("script");
    const failOnError = core.getInput("fail-on-error") === "true";

    let stdout = "";
    let stderr = "";
    let errorStatus = "false";
    const options = {};
    options.listeners = {
        stdout: (data) => {
            stdout += data.toString();
        },
        stderr: (data) => {
            stderr += data.toString();
        }
    };

    tmp.setGracefulCleanup();
    const filename = tmp.tmpNameSync({postfix: '.py'});
    fs.writeFileSync(filename, script);
    try {
        await exec.exec('python', [filename], options);
    } catch (error) {
        errorStatus = "true";
        if (failOnError) {
            core.setFailed(error);
        }
    } finally {
        core.setOutput("stdout", stdout);
        core.setOutput("stderr", stderr);
        core.setOutput("error", errorStatus);
    }
}

run();
