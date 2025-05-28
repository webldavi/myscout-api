export type UserLoginRequest = {
  email: string;
  password: string;
};

export const UserLoginRequestRules = {
  email: {
    type: "string", // <<< LITERAL aqui, não string genérico
    required: true,
    validator: (v: string) => /\S+@\S+\.\S+/.test(v),
  },
  password: {
    type: "string",
    required: true,
    validator: (v: string) => v.length >= 6,
  },
} as const;
