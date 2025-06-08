import { generateArrayKey } from "@/lib/utils/array-utils";
import { PricingCard } from "./pricing-card";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    period: "/month",
    description: "For getting started with Obby.",
    features: ["20 monthly credit", "Limited Agent use"],
    buttonText: "Start Building",
    buttonVariant: "outline" as const,
  },
  {
    title: "Premium",
    price: "$20",
    period: "/month",
    description: "For higher limits and power users.",
    features: [
      "100 credits per month",
      "Higher Agent use",
      "Higher image quality",
      "5x higher attachment size limit",
      "Import from Figma",
      "Priority support",
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "default" as const,
    recommended: true,
  },
  {
    title: "Team",
    price: "$30",
    period: "/user/month",
    description: "For fast moving teams and collaboration.",
    features: [
      "Everything in Premium",
      "Share chats between teams",
      "Admin panel to manage team members",
      "Team collaboration tools",
      "Advanced analytics",
      "Priority support",
    ],
    buttonText: "Upgrade to Team",
    buttonVariant: "secondary" as const,
  },
];

export function PricingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {pricingPlans.map((plan, index) => (
        <PricingCard
          key={generateArrayKey(index)}
          title={plan.title}
          price={plan.price}
          period={plan.period}
          description={plan.description}
          features={plan.features}
          buttonText={plan.buttonText}
          buttonVariant={plan.buttonVariant}
          recommended={plan.recommended}
        />
      ))}
    </div>
  );
}
