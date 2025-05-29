// server/modules/User/Http/Controllers/UserController.ts
import bcrypt from "bcrypt";
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return {
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
