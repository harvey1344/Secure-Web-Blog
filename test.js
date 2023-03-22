const assert = require('assert');
const {
    getPasswords,
    isPasswordCommon,
    isPasswordStrong,
} = require('./frontend/home.js');

describe('getPasswords', () => {
    it('should return an array of passwords', async () => {
        const result = await getPasswords();
        assert(Array.isArray(result), true);
    });
});

describe('isPasswordCommon', () => {
    it('should return true if password is in common password list', () => {
        const result = isPasswordCommon('password', ['password', '123456']);
        assert.equal(result, true);
    });

    it('should return false if password is not in common password list', () => {
        const result = isPasswordCommon('abcdefg', ['password', '123456']);
        assert.equal(result, false);
    });
});

describe('isPasswordStrong', () => {
    it('should return true if password is strong', () => {
        const result = isPasswordStrong('Passw0rd!#');
        assert.equal(result, true);
    });

    it('should return false if password is too short', () => {
        const result = isPasswordStrong('Passw0r');
        assert.equal(result, false);
    });

    it('should return false if password does not contain a number', () => {
        const result = isPasswordStrong('Password!');
        assert.equal(result, false);
    });

    it('should return false if password contains repeated characters', () => {
        const result = isPasswordStrong('Passssword!');
        assert.equal(result, false);
    });

    it('should return false if password contains a number sequence', () => {
        const result = isPasswordStrong('Pass123456!');
        assert.equal(result, false);
    });
});
