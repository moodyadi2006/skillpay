import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { FreelancerModel } from "@/model/Freelancer";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { EmployerModel } from "@/model/Employer";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface ExtendedJWT extends JWT {
  _id?: string;
  isVerified?: boolean;
  fullName?: string;
  email?: string;
  role?: string;
  resume?: string | null;
  feedbacks?: string[];
}

interface ExtendedSession extends Session {
  user: {
    _id?: string;
    isVerified?: boolean;
    fullName?: string;
    email?: string;
    role?: string;
    resume?: string | null;
    feedbacks?: string[];
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<any | null> {
        if (!credentials) {
          throw new Error("Credentials are missing");
        }
        await dbConnect();
        try {
          let user = await FreelancerModel.findOne({
            email: credentials.identifier,
          });
          let userType = "freelancer";

          if (!user) {
            user = await EmployerModel.findOne({
              email: credentials.identifier,
            });
            userType = "employer";
          }

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }

          // Ensure user object is correctly structured
          const userObject = user.toObject
            ? user.toObject()
            : { ...user.toJSON?.() };

          return { ...userObject, role: userType };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user?: any }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified ?? false;
        token.fullName = user.fullName ?? "";
        token.email = user.email ?? "";
        token.role = user.role ?? "user";
        if (user.role === "freelancer") {
          token.resume = user.resume ?? null;
          token.feedbacks = user.feedbacks ?? [];
        }
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedJWT;
    }) {
      if (!session.user) {
        session.user = {} as ExtendedSession["user"];
      }

      session.user._id = token._id ?? "";
      session.user.isVerified = token.isVerified ?? false;
      session.user.fullName = token.fullName ?? "";
      session.user.email = token.email ?? "";
      session.user.role = token.role ?? "user";

      if (token.role === "freelancer") {
        session.user.resume = token.resume ?? null;
        session.user.feedbacks = token.feedbacks ?? [];
      }

      return session;
    },
  },
};
