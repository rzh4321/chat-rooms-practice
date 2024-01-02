'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState<null | boolean>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoginError(false);
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      username: username,
    });
    if (res && !res.url) {
      setLoginError(true);
      setIsSubmitting(false);
    }
    else {
      router.push('/home');
    }
  };

  return (
    <>
      <label htmlFor="username">Username: </label>
      <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button disabled={isSubmitting} onClick={handleLogin}>Log in</button>
      {loginError && <div>login error</div>}
    </>
  )


}