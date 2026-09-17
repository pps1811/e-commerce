"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminProductSchema,
  type AdminProductFormInput,
} from "@/lib/validations/admin-product";
import { createProduct, updateProduct } from "@/actions/admin-product-actions";
import { ImageUploadInput } from "@/components/admin/image-upload-input";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<AdminProductFormInput>;
  cloudinaryConfigured?: boolean;
}

export function ProductForm({
  categories,
  productId,
  defaultValues,
  cloudinaryConfigured = false,
}: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormInput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      isActive: true,
      isNew: false,
      images: [{ url: "", alt: "" }],
      highlights: [],
      ...defaultValues,
    },
  });

  const imageFields = useFieldArray({ control, name: "images" });
  const highlights = useWatch({ control, name: "highlights" }) ?? [];
  const isActive = useWatch({ control, name: "isActive" });
  const isNew = useWatch({ control, name: "isNew" });

  async function onSubmit(data: AdminProductFormInput) {
    setServerError(null);
    const result = productId
      ? await updateProduct(productId, data)
      : await createProduct(data);

    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  function addHighlight() {
    setValue("highlights", [...highlights, ""]);
  }

  function updateHighlight(index: number, value: string) {
    const next = [...highlights];
    next[index] = value;
    setValue("highlights", next);
  }

  function removeHighlight(index: number) {
    setValue(
      "highlights",
      highlights.filter((_, i) => i !== index)
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} placeholder="aero-runner-sneakers" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="comparePrice">Compare price (₹)</Label>
          <Input id="comparePrice" type="number" step="0.01" {...register("comparePrice")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} />
          {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          items={categories.map((c) => ({ label: c.name, value: c.id }))}
          defaultValue={defaultValues?.categoryId}
          onValueChange={(value) => value && setValue("categoryId", value)}
        >
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label>Images</Label>
        {imageFields.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Controller
              control={control}
              name={`images.${index}.url` as const}
              render={({ field: { value, onChange } }) => (
                <ImageUploadInput
                  value={value}
                  onChange={onChange}
                  cloudinaryConfigured={cloudinaryConfigured}
                />
              )}
            />
            <Input
              placeholder="Alt text"
              {...register(`images.${index}.alt` as const)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={imageFields.fields.length === 1}
              onClick={() => imageFields.remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {errors.images && (
          <p className="text-xs text-destructive">
            {errors.images.message ?? errors.images.root?.message}
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => imageFields.append({ url: "", alt: "" })}
        >
          <Plus className="size-3.5" /> Add image
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Highlights</Label>
        {highlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              placeholder="e.g. Breathable knit upper"
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(index)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={addHighlight}>
          <Plus className="size-3.5" /> Add highlight
        </Button>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked) => setValue("isActive", checked === true)}
          />
          Active (visible in store)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isNew}
            onCheckedChange={(checked) => setValue("isNew", checked === true)}
          />
          Mark as new arrival
        </label>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : productId ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
