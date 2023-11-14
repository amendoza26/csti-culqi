import { SignIn, getCardDataByToken } from "../services/tokenService";
test("debe arrojar error si el ccv tiene mas de 4 digitos", () => {
  const cardData = {
    cardNumber: 1234567812345670,
    expiration_month: "12",
    expiration_year: "2024",
    cvv: 12345,
    email: "test@gmail.com",
  };

  expect(() => SignIn(cardData)).toThrowError(
    "El campo cvv debe tener 3 o 4 dígitos."
  );
});
test("debe arrojar error, mail no es gmail.com, hotmail.com o yahoo.es", () => {
  const cardData = {
    cardNumber: 1234567812345670,
    expiration_month: "12",
    expiration_year: "2025",
    cvv: 12,
    email: "invalidemail@example.com",
  };

  expect(() => SignIn(cardData)).toThrowError(
    'El campo email debe tener entre 5 y 100 caracteres y ser un email válido con los dominios "gmail.com", "hotmail.com" o "yahoo.es".'
  );
});
test("ejemplo correcto", () => {
  const validCardData = {
    cardNumber: 1234567812345670,
    expiration_month: "12",
    expiration_year: "2025",
    cvv: 123,
    email: "test@gmail.com",
  };

  expect(() => SignIn(validCardData)).not.toThrow();
});
