import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import { env } from "$env/dynamic/private";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "pg" or "mysql"
    }),

    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID as string,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
            
        },
    },
})