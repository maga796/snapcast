import { SignIn, SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return <section className="auth-notice"><h1>Sign-in unavailable</h1><p>Sign-in is not configured yet. Please try again later.</p></section>;
  }
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return mode === "sign-in" ? <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /> : <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />;
}
