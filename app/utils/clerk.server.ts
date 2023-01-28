import { createClerkClient } from "@clerk/remix/api.server";

const clerkClient = createClerkClient({ apiKey: process.env.CLERK_SECRET_KEY });

export default clerkClient;
