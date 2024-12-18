import NextAuth, { Session } from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { createGuest, getGuest } from "./data-service";

//JMARDEBUG: What does this do?
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string;
      image?: string;
      guestId?: string;
    };
  }
}

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({
      auth,
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }) {
      return Boolean(auth?.user);
    },
    async signIn({ user }: { user: User }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest) {
          await createGuest({ email: user.email, full_name: user.name });
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        const guest = await getGuest(session.user?.email);
        session.user.guestId = guest.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
