import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { sendEmail } from "./mail";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
  ],
  // secret: process.env.JWT_SECRET || "secret",

  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.number = user.number;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.number = token.number;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }

      return session;
    },
  },
  events: {
    async signIn({ user }: any) {
      if (user.email) {
        const message = `Hello ${user.name},  

        👋 Welcome back to Qivee!  

        It's great to see you again. We’ve got fresh new arrivals, exclusive deals, and personalized recommendations waiting just for you.  

        Here’s what’s new since your last visit:  
        Trending products you might love  
        Special discounts & limited-time offers  
        Faster checkout for a seamless shopping experience  

        Ready to continue your shopping journey? Start here: www.qivee.com  

        If you need any help, we're just a message away!  

        Happy shopping! 🛒  
        Best Regards,  
        The Qivee Team  
        support@qivee.com | www.qivee.com  
        `;

        try {
          await sendEmail({
            email: user.email,
            subject: "Welcome back to Qivee",
            message,
          });
        } catch (error) {
          console.error("Failed to send welcome email:", error);
        }
      }
    },
  },
};
