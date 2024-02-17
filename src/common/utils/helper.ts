import { SearchDto } from '../dtos';
import * as bcrypt from 'bcrypt';

export const toLocalDatetime = (date: Date): Date => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date;
};

export const toLocalDatetimeString = (date: Date): string => {
  return toLocalDatetime(date).toISOString();
};

export const getPagination = (searchDto: SearchDto): any => {
  if (searchDto.limit === '0' || searchDto.page === '0') {
    return { limit: undefined, offset: 0, keyword: searchDto.keyword };
  } else {
    const limit: number =
      isNaN(parseInt(searchDto.limit)) === false ? Math.abs(parseInt(searchDto.limit)) : 10;
    const page: number =
      isNaN(parseInt(searchDto.page)) === false ? Math.abs(parseInt(searchDto.page)) : 1;
    const offset: number = (page - 1) * limit;

    return { limit: limit, offset: offset, keyword: searchDto.keyword };
  }
};

export const compareHashedString = (plainText: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

export const hashString = (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, Number(process.env.BCRYPT_SALT));
};

export const isValidURL = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator

  return !!pattern.test(str);
};

export const generateRandomNumber = (maxNum: number): number => {
  if (maxNum < 1) {
    return;
  } else {
    return Math.floor(Math.random() * Math.pow(10, maxNum));
  }
};

export const lowerCharacters: string = 'abcdefghijklmnopqrstuvwxyz';
export const upperCharacters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const numberCharacters: string = '0123456789';
export const otherCharacters: string = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
export const allCharacters: string =
  lowerCharacters + upperCharacters + numberCharacters + otherCharacters;

const generateRandomString = (num: number, characters: string): string => {
  if (num < 0) {
    return;
  } else {
    let res: string = '';

    for (let cnt: number = 0; cnt < num; cnt++) {
      res += characters[Math.floor(Math.random() * characters.length)];
    }

    return res;
  }
};

export const generateRandomPassword = (
  num: number = 8,
  characters: string = allCharacters,
): string => {
  return generateRandomString(num, characters);
};

export const generateRandomOtp = (
  num: number = 6,
  characters: string = numberCharacters,
): string => {
  return generateRandomString(num, characters);
};

export const caculateExpense = (startDate: Date, endDate: Date, price: number): number => {
  return price * Math.ceil((endDate.getTime() - startDate.getTime()) / 3600000);
  
};
