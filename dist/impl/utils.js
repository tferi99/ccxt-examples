"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const log = require("ololog");
const consts = require('./consts');
log.configure({ locate: false });
const fileExists = (path) => {
    try {
        return fs.existsSync(path);
    }
    catch (err) {
        log.error(err);
        return false;
    }
};
exports.fileExists = fileExists;
const loadCredentials = () => {
    let file = consts.CREDENTIALS;
    if (!fileExists(file)) {
        throw consts.CREDENTIALS + ' does not exists';
    }
    return require(file);
};
exports.loadCredentials = loadCredentials;
//# sourceMappingURL=utils.js.map