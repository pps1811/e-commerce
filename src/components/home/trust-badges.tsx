import { RotateCcw, ShieldCheck, Truck, Headset } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free shipping",
    description: "On all orders over ₹2,000",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "30-day return window",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Payments verified server-side",
  },
  {
    icon: Headset,
    title: "24/7 support",
    description: "We're here to help",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <badge.icon className="size-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
