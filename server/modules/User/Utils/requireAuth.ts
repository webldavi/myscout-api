// server/utils/requireAuth.ts
import { getCookie, H3Event } from "h3";
import jwt from "jsonwebtoken";

export async function requireAuth(event: H3Event) {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Não autenticado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    event.context.user = payload;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Token inválido" });
  }
}
