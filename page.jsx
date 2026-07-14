"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendMagicLink = async (e) => {
    e.preventDefault();
    await signIn("email", { email, redirect: false });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="login-wrap">
        <h1>Check your email</h1>
        <p>We sent a sign-in link to {email}. Click it to log in — no password needed.</p>
      </div>
    );
  }

  return (
    <div className="login-wrap">
      <h1>ONE ROOF</h1>

      <button onClick={() => signIn("facebook")} className="fb-btn">
        Continue with Facebook
      </button>

      <div className="divider">or</div>

      <form onSubmit={sendMagicLink}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Email me a sign-in link</button>
      </form>
    </div>
  );
}
