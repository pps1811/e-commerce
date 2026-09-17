"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, Package, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore, useHasCartHydrated } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";

interface SiteHeaderProps {
  categories: Category[];
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const { data: session, status } = useSession();
  const cartHydrated = useHasCartHydrated();

  const navLinks = [
    { label: "New Arrivals", href: "/products?filter=new" },
    ...categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          Aurelle
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div
            className={cn(
              "hidden items-center transition-all sm:flex",
              searchOpen ? "w-56 md:w-72" : "w-9"
            )}
          >
            {searchOpen ? (
              <form
                action="/products"
                className="flex w-full items-center"
                onSubmit={() => setSearchOpen(false)}
              >
                <Input
                  autoFocus
                  name="q"
                  placeholder="Search products…"
                  className="h-9"
                  onBlur={() => setSearchOpen(false)}
                />
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-[1.1rem]" />
              </Button>
            )}
          </div>

          <ThemeToggle />

          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Account menu">
                    <User className="size-[1.1rem]" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {session.user?.name ?? session.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/account" />}>
                  <User className="size-4" /> My account
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/orders" />}>
                  <Package className="size-4" /> Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LinkButton href="/login" variant="ghost" size="icon" aria-label="Sign in">
              <User className="size-[1.1rem]" />
            </LinkButton>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="size-[1.1rem]" />
            {cartHydrated && itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="font-heading text-xl">Aurelle</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <CartDrawer />
    </header>
  );
}
