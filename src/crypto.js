'use strict';

var os = require('os');
const crypto = require('crypto');
var macaddress = require('macaddress');

let _k;
const _kPromise = macaddress.one().then(function (mac) {
    _k = os.platform();
    _k += mac;
    _k += os.cpus().reduce((a, cpu) => `${a}-${cpu.model}`, '');
    _k = _k.slice(0, 32);
});

const IV_LENGTH = 16;

async function encrypt(text) {
    try {
        await _kPromise;
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(_k), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        throw e;
    }
}

async function decrypt(text) {
    try {
        await _kPromise;
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(_k),
            iv
        );
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        if (!decrypted.toString() || decrypted.toString() === ' ')
            throw new Error('Empty password decrypted');

        return decrypted.toString();
    } catch (e) {
        throw e;
    }
}

module.exports = { decrypt, encrypt };
