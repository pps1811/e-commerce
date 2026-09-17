"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCategorySchema, type AdminCategoryInput } from "@/lib/validations/admin-product";
import { createCategory } from "@/actions/admin-product-actions";
import { ImageUploadInput } from "@/components/admin/image-upload-input";

interface CategoryFormProps {
  cloudinaryConfigured?: boolean;
}

export function CategoryForm({ cloudinaryConfigured = false }: CategoryFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCategoryInput>({ resolver: zodResolver(adminCategorySchema) });

  async function onSubmit(data: AdminCategoryInput) {
    setServerError(null);
    const result = await createCategory(data);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <form
      className="flex h-fit flex-col gap-3 rounded-xl border p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="font-heading text-sm font-semibold">Add category</h2>

      <div className="flex flex-col gap-1">
        <Label htmlFor="cat-name">Name</Label>
        <Input id="cat-name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="cat-slug">Slug</Label>
        <Input id="cat-slug" {...register("slug")} placeholder="footwear" />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="cat-image">Image (optional)</Label>
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <ImageUploadInput
              value={value ?? ""}
              onChange={onChange}
              cloudinaryConfigured={cloudinaryConfigured}
            />
          )}
        />
        {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Saving…" : "Add category"}
      </Button>
    </form>
  );
}
