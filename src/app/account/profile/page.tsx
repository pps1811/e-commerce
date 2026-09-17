import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileForm } from "@/components/account/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/profile");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-muted-foreground">Update your name and see your account email.</p>

      <div className="mt-8">
        <ProfileForm name={session.user.name ?? ""} email={session.user.email ?? ""} />
      </div>
    </div>
  );
}
