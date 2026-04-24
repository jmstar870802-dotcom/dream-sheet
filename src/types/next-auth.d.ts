import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
        id: number;
        userName: string;
        birthday: string;
        mngrSe: string;
    } & DefaultSession["user"];
  }

  interface User {
    birthday?: birthday;
    mngrSe?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName: string;
    birthday: string;
    mngrSe: string;
  }
}