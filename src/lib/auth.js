import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("study-nook");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "https://study-nook-client-omega.vercel.app",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://study-nook-client-omega.vercel.app",
  ],

  advanced: {
    cookies: {
      session_token: {
        attributes: {
          httpOnly: false,
        },
      },
    },
  },
});
