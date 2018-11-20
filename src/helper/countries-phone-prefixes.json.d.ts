interface ICountriesPhonePrefixes {
    [key: string]: {
        name: string;
        iso2: string;
        code: string;
    }
}

export const countries: ICountriesPhonePrefixes;