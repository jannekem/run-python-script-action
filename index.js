const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const tmp = require('tmp');


async function run() {
    const script = core.getInput("script");
    const util = core.getInput("util") === "true";
    const failOnError = core.getInput("fail-on-error") === "true";
    const utilityFunctions = fs.readFileSync(`${__dirname}/util.py`);

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
    fs.writeFileSync(filename, util ? utilityFunctions + script : script);
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
