import { SignIn, getCardDataByToken } from "../services/tokenService";
const { tokenService } = require("../services/tokenService");
import { Request, Response, NextFunction } from "express";

interface CardData {
  cardNumber: number;
  expiration_month: string;
  expiration_year: string;
  cvv?: number;
  email: string;
}

export const createToken = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const cardData = req.body as CardData;

  // Llama a la función SignIn para crear el token
  const token = await SignIn(cardData);

  // Envia el token como respuesta
  res.json({ token });
};

export const getCardData = (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autorización no válido." });
  }

  const token = authorizationHeader.split("Bearer ")[1];

  const cardData = getCardDataByToken(token);

  if (cardData) {
    res.json(cardData);
  } else {
    res.status(401).json({ error: "Token inválido o ha expirado." });
  }
};
