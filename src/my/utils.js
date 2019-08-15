const fs = require('fs')
const log = require ('ololog').configure ({ locate: false })
const consts = require ('./consts')

fileExists = function(path) {
    try {
        return fs.existsSync(path);
    } catch (err) {
        log.error(err)
        return false
    }
}

loadCredentials = function() {
    let file = consts.CREDENTIALS;
    if (!fileExists(file)) {
        throw consts.CREDENTIALS + ' does not exists';
    }
    return creads = require(file);
}

module.exports = {
    fileExists, loadCredentials
}

