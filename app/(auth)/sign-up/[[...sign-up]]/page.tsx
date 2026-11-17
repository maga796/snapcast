import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return <Suspense fallback={<p role="status">Loading sign-up…</p>}><AuthForm mode="sign-up" /></Suspense>;
}
