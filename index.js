const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const tmp = require('tmp');

async function run() {
    tmp.setGracefulCleanup();
    const script = core.getInput('script');
    const filename = tmp.tmpNameSync({postfix: '.py'});
    fs.writeFileSync(filename, script);
    exec.exec('python', [filename])
}

run();
