import * as contriesPhonePrefixes from './countries-phone-prefixes.json';
import zxcvbn from 'zxcvbn';
import { isEmpty, get, find } from 'lodash';
import { Moment } from 'moment';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const numbersRegex = /^[0-9]*$/;

export const numbersAndLetterRegex = /^[a-zA-Z0-9]*$/;

export const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

export const getPhoneNumber = (value: number, prefix: string) => {
    return '+' + get(contriesPhonePrefixes.countries[prefix], 'code') + value;
};

export const validatePhoneNumber = (value: number, prefix: string) => {
    try {
        const phoneNumber = getPhoneNumber(value, prefix);
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

export const validatePassword = (value: any, statePassword: any) => {
    const strength = zxcvbn(value);
    const percent = (strength.score + 1) * 20;
    const hint = `For crack your password through internet good hacker need ${
        strength.crack_times_display.online_no_throttling_10_per_second
        }`;
    const base = {
        value,
        hint,
        percent,
        errorMsg: strength.feedback.suggestions
    };

    if (isEmpty(value))
        return {
            ...base,
            errorMsg: 'Password is required',
            validateStatus: 'error',
            status: 'exception',
            title: 'Password can\' be empty'
        };

    if (percent < 30)
        return {
            ...base,
            validateStatus: 'error',
            status: 'exception',
            title: 'Password is too simple'
        };

    if (percent < 50)
        return {
            ...base,
            validateStatus: 'warning',
            status: 'exception',
            title: 'Password is not good enough'
        };


    if (percent < 70)
        return {
            ...base,
            validateStatus: 'warning',
            status: 'active',
            title: 'Password is particular secure, add something more'
        };


    return {
        ...statePassword,
        ...base,
        validateStatus: 'success',
        successPercent: percent,
        title: percent === 100 ? 'Password is really secure' : 'Password is good but it can be better'
    };
};

export const getNumberAndPrefix = (phoneNumber: any) => {
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);
    const countryCode = number.getCountryCode();
    const nationalNumber = number.getNationalNumber();
    const prefix = get(
        find(contriesPhonePrefixes.countries, (entry: any) => entry.code === '' + countryCode)
        , 'iso2'
    );

    return {
        value: nationalNumber,
        prefix
    };
};

export const isDateAndPeselCorrect = (pesel: any, date: Moment) => {
    const expectedYear = date.year() % 100;
    let expectedMonth: string | number  = date.month() + 1;
    if (date.year() < 1900)
        expectedMonth += 80;
    else if (date.year() > 2000)
        expectedMonth += 20;

    let expectedDay: string | number = date.date();
    if (expectedDay < 10)
        expectedDay = '0' + expectedDay;
    if (expectedMonth < 10)
        expectedMonth = '0' + expectedMonth;
    console.log(expectedYear, expectedMonth, expectedDay);
    const doesYearMatch = pesel.substring(0, 2) === '' + expectedYear;
    const doesMonthMatch = pesel.substring(2, 4) === '' + expectedMonth;
    const doesDayMatch = pesel.substring(4, 6) === '' + expectedDay;

    return doesDayMatch && doesMonthMatch && doesYearMatch;
};