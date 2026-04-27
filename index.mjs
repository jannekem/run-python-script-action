import * as core from '@actions/core';
import * as exec from '@actions/exec';
import fs from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import tmp from 'tmp';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
    const script = core.getInput("script");
    const util = core.getInput("util") === "true";
    const failOnError = core.getInput("fail-on-error") === "true";
    const utilityFunctions = fs.readFileSync(join(__dirname, "util.py"), "utf8");

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
    const filename = tmp.tmpNameSync({postfix: ".py"});
    fs.writeFileSync(filename, util ? utilityFunctions + script : script);
    try {
        await exec.exec("python", [filename], options);
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
