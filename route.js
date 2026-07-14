import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
// Swap this for whatever DB adapter you use (Prisma, Supabase, etc).
// The adapter is what makes accounts and sessions actually persist.
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // --- Real "Login with Facebook" ---
    // Requires a Facebook Developer App (developers.facebook.com):
    // 1. Create an app -> add "Facebook Login" product
    // 2. Set a valid OAuth redirect URI to: https://YOURDOMAIN.com/api/auth/callback/facebook
    // 3. Copy the App ID and App Secret into your .env file below
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),

    // --- Real email magic link ---
    // Requires an SMTP or email API provider (Resend, Postmark, SendGrid, etc).
    // NextAuth sends a one-time sign-in link to the email the user enters.
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/login", // your custom login page (email input + FB button)
    verifyRequest: "/login/check-email", // "check your inbox" page after magic link is sent
  },
  session: {
    strategy: "database", // real persistent sessions, not just browser memory
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.subscriptionStatus = user.subscriptionStatus;
      session.user.trialEndsAt = user.trialEndsAt;
      return session;
    },
  },
  events: {
    // Runs once, the very first time someone signs up (FB or email).
    // Starts their 30-day trial immediately — no card, nothing to enter.
    async createUser({ user }) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "trialing", trialEndsAt },
      });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
