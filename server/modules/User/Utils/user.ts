
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/prisma";

export const getUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({ where });
};
