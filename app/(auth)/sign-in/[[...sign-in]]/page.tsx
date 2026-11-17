import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return <Suspense fallback={<p role="status">Loading sign-in…</p>}><AuthForm mode="sign-in" /></Suspense>;
}
