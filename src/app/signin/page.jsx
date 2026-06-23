"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Sign in failed.");
      setLoading(false);
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    
    if (error) {
      toast.error(error.message || "Google sign in failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-100 space-y-8">
        
        <div className="text-center">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details to continue.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">Email</label>
              <input
                required
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-foreground focus:ring-0 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">Password</label>
              <input
                required
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-foreground focus:ring-0 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background font-medium text-sm h-10 rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-border"></div>
            <span className="shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-widest">or</span>
            <div className="grow border-t border-border"></div>
          </div>

          <button 
            type="button" 
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center gap-2 bg-background border border-border text-foreground font-medium text-sm h-10 rounded-sm hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;