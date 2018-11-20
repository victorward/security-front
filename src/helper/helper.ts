import * as contriesPhonePrefixes from './countries-phone-prefixes.json';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const numbersRegex = /^[0-9]*$/;

export const validateIdentityCard = (num: string) => {
    // Check length
    if (!num || num.length !== 9) {
        return false;
    }

    const upperNum = num.toUpperCase();
    const letterValues = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    const getLetterValue = (letter: string) => {
        for (let j = 0, max = letterValues.length; j < max; j++) {
            if (letter === letterValues[j]) {
                return j;
            }
        }
        return -1;
    };

    // check series
    for (let i = 0; i < 3; i++) {
        if (getLetterValue(upperNum[i]) < 10) {
            return false;
        }
    }
    // check number
    for (let i = 3; i < 9; i++) {
        if (getLetterValue(upperNum[i]) < 0 || getLetterValue(upperNum[i]) > 9) {
            return false;
        }
    }

    // checksum
    let sum = 7 * getLetterValue(upperNum[0]) +
        3 * getLetterValue(upperNum[1]) +
        1 * getLetterValue(upperNum[2]) +
        7 * getLetterValue(upperNum[4]) +
        3 * getLetterValue(upperNum[5]) +
        1 * getLetterValue(upperNum[6]) +
        7 * getLetterValue(upperNum[7]) +
        3 * getLetterValue(upperNum[8]);

    sum %= 10;

    return sum === getLetterValue(upperNum[3]);
};

export const validatePeselNumbers = (pesel: number): boolean => {
    const dig = ('' + pesel).split('');
    let control = (parseInt(dig[0], 10) + 3 * parseInt(dig[1], 10) + 7 * parseInt(dig[2], 10) + 9
        * parseInt(dig[3], 10) + 1 * parseInt(dig[4], 10) + 3 * parseInt(dig[5], 10) + 7
        * parseInt(dig[6], 10) + 9 * parseInt(dig[7], 10) + 1 * parseInt(dig[8], 10) + 3
        * parseInt(dig[9], 10)) % 10;

    if (control === 0)
        control = 10;

    control = 10 - control;

    return parseInt(dig[10], 10) === control;
};


export const validatePhoneNumber = (value: number, prefix: string) => {
    try {
        const phoneNumber = '+' + contriesPhonePrefixes.countries[prefix].code + value;
        const number = phoneUtil.parseAndKeepRawInput(phoneNumber, prefix);
        const isValid = phoneUtil.isValidNumber(number);
        if (!isValid)
            return {
                validateStatus: 'error',
                errorMsg: 'Is not phone number'
            };
    } catch (e) {
        return {
            validateStatus: 'error',
            errorMsg: 'Is not phone number'
        };
    }

    return {
        validateStatus: 'success',
        errorMsg: null
    };
};
