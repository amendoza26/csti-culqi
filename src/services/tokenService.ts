const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

interface CardData {
  cardNumber: number;
  expiration_month: string;
  expiration_year: string;
  cvv?: number;
  email: string;
}
export const SignIn = (cardData: CardData): string => {
  // validacion de expiration_month
  if (!isValidExpirationMonth(cardData.expiration_month)) {
    throw new Error(
      "El campo expiration_month debe ser un número entre 1 y 12."
    );
  }
  // validacion de expiration_year
  if (!isValidExpirationYear(cardData.expiration_year)) {
    throw new Error(
      "El campo expiration_year debe tener 4 caracteres y estar entre el año actual y 5 años más adelante."
    );
  }
  // validacion de email
  if (!isValidEmail(cardData.email)) {
    throw new Error(
      'El campo email debe tener entre 5 y 100 caracteres y ser un email válido con los dominios "gmail.com", "hotmail.com" o "yahoo.es".'
    );
  }
  // validacion de cvv
  if (!isValidCvv(cardData.cvv)) {
    throw new Error("El campo cvv debe tener 3 o 4 dígitos.");
  }
  // validacion de cardNumber
  if (isValidCardNumber(cardData.cardNumber)) {
    console.log("El número de tarjeta de crédito es válido.");
  } else {
    throw new Error("El número de tarjeta de crédito no es válido.");
  }

  const payload = {
    cardNumber: cardData.cardNumber,
    expiration_month: cardData.expiration_month,
    expiration_year: cardData.expiration_year,
    cvv: cardData.cvv,
    email: cardData.email,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1m" });

  return token;
};

export const getCardDataByToken = (token: string): CardData | null => {
  try {
    const decodedToken = jwt.verify(token, secretKey) as { [key: string]: any };
    // Excluir el CVV antes de devolver los datos de la tarjeta
    const cardDataWithoutCvv: CardData = {
      cardNumber: decodedToken.cardNumber,
      expiration_month: decodedToken.expiration_month,
      expiration_year: decodedToken.expiration_year,
      email: decodedToken.email,
    };
    return cardDataWithoutCvv;
  } catch (error) {
    return null;
  }
};

const isValidCvv = (cvv?: number): boolean => {
  if (cvv === undefined) {
    return false;
  }

  const cvvRegex = /^[0-9]{3,4}$/;
  return cvvRegex.test(cvv.toString());
};

const isValidCardNumber = (cardNumber: number): boolean => {
  const cardNumberStr = cardNumber.toString().replace(/\s/g, "");

  const reversedCardNumber = cardNumberStr.split("").reverse().join("");

  let sum = 0;
  let double = false;

  for (const digit of reversedCardNumber) {
    let num = parseInt(digit, 10);

    if (double) {
      num *= 2;
      if (num > 9) {
        num -= 9;
      }
    }

    sum += num;
    double = !double;
  }
  return sum % 10 === 0;
};

export const isValidPk = (pk: string | undefined): boolean => {
  const pkRegex = /^[a-zA-Z0-9_-]+$/;

  return !!pk && pkRegex.test(pk);
};

const isValidExpirationMonth = (expiration_month: string): boolean => {
  const monthNumber = parseInt(expiration_month, 10);
  return Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
};
const isValidExpirationYear = (expiration_year?: string): boolean => {
  if (expiration_year === undefined) {
    return false;
  }

  const currentYear = new Date().getFullYear();
  const yearNumber = Number(expiration_year);

  return (
    expiration_year.length === 4 &&
    !isNaN(yearNumber) &&
    yearNumber >= currentYear &&
    yearNumber <= currentYear + 5
  );
};
const isValidEmail = (email?: string): boolean => {
  if (email === undefined) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[gmail|hotmail|yahoo]+\.[a-z]{2,4}$/;

  return email.length >= 5 && email.length <= 100 && emailRegex.test(email);
};
