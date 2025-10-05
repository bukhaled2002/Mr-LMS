import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupForm from "./_components/SignupForm";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    return redirect("/");
  }
  return (
    <>
      <SignupForm />
      <div className="text-center text-sm text-muted-foreground text-balance">
        By clicking continue, you agree to our{" "}
        <span className="hover:text-primary hover:underline">
          Terms of service
        </span>{" "}
        and
        <span className="hover:text-primary hover:underline">
          {" "}
          Privacy Policy
        </span>
      </div>
    </>
  );
}
