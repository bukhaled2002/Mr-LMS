import { emailOTPClient, adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [emailOTPClient(), adminClient()],
});

export type Session = typeof authClient.$Infer.Session;
