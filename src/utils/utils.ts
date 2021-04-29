const fs = require('fs')
import * as log from 'ololog';
import { CREDENTIAL_CONFIG } from '../constants';
//import * as constants from './constants';

log.configure({locate: false});

export const fileExists = (path) => {
    try {
        return fs.existsSync(path);
    } catch (err) {
        log.error(err)
        return false
    }
}

export const loadCredentials = () => {
    let file = CREDENTIAL_CONFIG;
    if (!fileExists(file)) {
        throw CREDENTIAL_CONFIG + ' does not exists';
    }
    return require(file);
}

export const prittyPrintObjectAsJSON = (obj: any, title: string) => {
    if (title) {
        console.log(title + ":");
    }
    if (obj) {
        console.log(JSON.stringify(obj, null, 4));
    } else {
        console.log('<undefined>');
    }
}


