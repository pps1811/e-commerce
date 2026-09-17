"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <Mail className="size-8" />
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="max-w-md text-sm text-primary-foreground/80">
          Sign up for our newsletter to receive exclusive offers, new arrivals, and styling tips.
        </p>
        {submitted ? (
          <p className="text-sm font-medium">Thanks for subscribing! Check your inbox.</p>
        ) : (
          <form
            className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Input
              type="email"
              required
              placeholder="Enter your email"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button type="submit" variant="secondary" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
