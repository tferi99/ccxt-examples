const fs = require('fs')
import * as log from 'ololog';
import { CREDENTIAL_CONFIG } from '../constants';
//import * as constants from './constants';

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
    let file = CREDENTIAL_CONFIG;
    if (!fileExists(file)) {
        throw CREDENTIAL_CONFIG + ' does not exists';
    }
    return require(file);
}

export {fileExists, loadCredentials}

