"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile-actions";

interface ProfileFormProps {
  name: string;
  email: string;
}

export function ProfileForm({ name: initialName, email }: ProfileFormProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateProfile(name);
    setSaving(false);

    if (!result.success) {
      setMessage({ type: "error", text: result.error ?? "Something went wrong" });
      return;
    }

    await update({ user: { name } });
    setMessage({ type: "success", text: "Profile updated" });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
        <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "error" ? "text-destructive" : "text-success"}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={saving} className="mt-2 self-start">
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
