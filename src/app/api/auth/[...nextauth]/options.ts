import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { FreelancerModel } from "@/model/Freelancer";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { EmployerModel } from "@/model/Employer";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          // Check in FreelancerModel first
          let user = await FreelancerModel.findOne({
            email: credentials.identifier,
          });
          let userType = "freelancer"; // Default user type

          // If not found in FreelancerModel, check EmployerModel
          if (!user) {
            user = await EmployerModel.findOne({
              email: credentials.identifier,
            });
            userType = "employer"; // Change user type if found in EmployerModel
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

          // Attach userType to user object for NextAuth
          return { ...user.toObject(), role: userType };
        } catch (error: any) {
          throw new Error(error.message);
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;

        // Only include resume and feedbacks when role is freelancer
        if (user.role === "freelancer") {
          token.resume = user?.resume;
          token.feedbacks = user?.feedbacks;
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.role = token.role;

        // Only include resume and feedbacks when role is freelancer
        if (token.role === "freelancer") {
          session.user.resume = token?.resume;
          session.user.feedbacks = token?.feedbacks;
        }
      }
      return session;
    },
  },
};
