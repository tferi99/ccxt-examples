const fs = require('fs')
import * as log from 'ololog';
const consts = require ('./consts')

log.configure({locate: false});

const fileExists = (path) => {
    try {
        return fs.existsSync(path);
    } catch (err) {
        log.error(err)
        return false
    }
}

const loadCredentials = () => {
    let file = consts.CREDENTIALS;
    if (!fileExists(file)) {
        throw consts.CREDENTIALS + ' does not exists';
    }
    return require(file);
}

export {fileExists, loadCredentials}

