// server/modules/User/Requests/UserRegisterRequest.ts
export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const UserRegisterRequestRules = {
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  password: {
    type: "string",
    required: true,
    validator: (v: string) => v.length >= 6,
  },
} as const;
