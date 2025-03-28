import { getServerSession, type Session } from "next-auth";
import { authOptions } from "./authOptions";

export async function auth(): Promise<Session | null> {
  return await getServerSession(authOptions);
}
