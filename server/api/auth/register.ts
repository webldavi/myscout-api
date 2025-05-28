import { UserController } from "~/server/modules/User/Http/Controllers/UserController";

export default defineEventHandler(async (event) => {
  return await UserController.register(event);
});
