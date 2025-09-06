import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useLogout() {
  const router = useRouter();
  return async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("signed out successfully");
          router.push("/");
        },
        onError: () => {
          toast.error("Error in logging out");
        },
      },
    });
  };
}
