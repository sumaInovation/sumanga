
// lib/auth-options.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          await User.updateOne(
            { email: user.email },
            { lastLogin: new Date() }
          );

          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email,
            role: user.role,
            image: user.image
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === "credentials") {
          return true;
        }

        if (account.provider === "google") {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              role: "user",
              emailVerified: new Date(),
              createdAt: new Date(),
            });
            
            user.id = newUser._id.toString();
            user.role = newUser.role;
          } else {
            await User.updateOne(
              { email: user.email },
              { 
                lastLogin: new Date(),
                name: user.name,
                image: user.image
              }
            );
            
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
          }
          
          return true;
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return true;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider;
      }

      if (token.id) {
        try {
          await connectDB();
          const currentUser = await User.findById(token.id);
          if (currentUser && currentUser.role !== token.role) {
            console.log("🔄 Role updated in token:", {
              oldRole: token.role,
              newRole: currentUser.role
            });
            token.role = currentUser.role;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
};