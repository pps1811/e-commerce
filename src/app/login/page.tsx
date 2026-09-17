import { Suspense } from "react";
import { LoginForm } from "@/components/account/login-form";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
