// server/modules/User/Requests/UserRegisterRequest.ts
export interface UserRegisterRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  password: string;
}

export const UserRegisterRequestRules = {
  first_name: {
    type: "string",
    required: true,
  },
  last_name: {
    type: "string",
    required: true,
  },
  phone_number: {
    type: "string",
    required: true,
  },
  date_of_birth: {
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
