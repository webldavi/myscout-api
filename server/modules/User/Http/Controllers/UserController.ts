// server/modules/User/Http/Controllers/UserController.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../utils/prisma";
import { parseAndValidateBody } from "../../../../utils/body";
import { getUser } from "../../Utils/user";
import type { UserRegisterRequest } from "../Requests/UserRegisterRequest";
import { UserRegisterRequestRules } from "../Requests/UserRegisterRequest";
import type { UserLoginRequest } from "../Requests/UserLoginRequest";
import { UserLoginRequestRules } from "../Requests/UserLoginRequest";

export class UserController {
  public static async register(event: any) {
    const body = await parseAndValidateBody<UserRegisterRequest>(
      event,
      UserRegisterRequestRules
    );

    const userExists = await getUser({ email: body.email });

    if (userExists) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email já está em uso",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      message: "Usuário registrado com sucesso",
      user,
    };
  }

  public static async login(event: any) {
    const body = await parseAndValidateBody<UserLoginRequest>(
      event,
      UserLoginRequestRules
    );

    const user = await getUser({ email: body.email });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Credenciais inválidas",
      });
    }

    const passwordValid = await bcrypt.compare(body.password, user.password);

    if (!passwordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Credenciais inválidas",
      });
    }

    const token = signJwt({ id: user.id });

    setCookie(event, "auth_token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return {
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    };
  }

  public static async me(event: any) {
    const token = getCookie(event, "auth_token");

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Não autenticado",
      });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: "Token inválido",
      });
    }

    const user = await getUser(
      { id: payload.id },
      {
        first_name: true,
        last_name: true,
        email: true,
        date_of_birth: true,
        id: true,
        phone_number: true,
      }
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "Usuário não encontrado",
      });
    }

    return { data: user };
  }
}
