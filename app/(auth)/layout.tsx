import Link from "next/link";
import { Sora } from "next/font/google";
import "./auth.css";

const sora = Sora({ subsets: ["latin"] });
export const metadata = { title: "Sign in · Reelwise" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className={`auth-page ${sora.className}`}><Link href="/dashboard" className="auth-wordmark" aria-label="Reelwise dashboard">Reel<span>wise</span></Link>{children}</main>;
}
