import { Check } from "lucide-react";
import { PricingButton } from "./pricing-button";
import { generateArrayKey } from "lib/utils/array-utils";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "secondary" | "outline";
  recommended?: boolean;
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  recommended = false,
}: PricingCardProps) {
  if (recommended) {
    return (
      <div className="rounded-lg p-[1px] h-full bg-gradient-to-br from-[var(--obby-purple)] via-[var(--obby-violet)] via-[var(--obby-pink)] to-[var(--obby-orange)]">
        <div className="bg-background rounded-lg h-full">
          <div className="h-full border-0 bg-transparent rounded-lg overflow-hidden flex flex-col relative">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <div className="rounded-full px-3 py-1 text-xs font-medium relative overflow-hidden">
                <span className="absolute inset-0 obby-gradient opacity-90" />
                <span className="relative text-white">Popular</span>
              </div>
            </div>

            <div className="text-center pb-6 px-6 pt-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold">{price}</span>{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  {period}
                </span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Features - flex-1 to take remaining space */}
            <div className="px-6 space-y-3 flex-1">
              {features.map((feature, index) => (
                <div
                  key={generateArrayKey(index)}
                  className="flex items-start gap-2"
                >
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 pt-6 mt-auto">
              <div className="relative rounded-md overflow-hidden">
                <PricingButton planTitle={title}>{buttonText}</PricingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border rounded-lg overflow-hidden flex flex-col">
      <div className="text-center pb-6 px-6 pt-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold">{price}</span>
          <span className="text-lg font-normal text-muted-foreground">
            {period}
          </span>
        </div>
        <p className="text-sm mt-2 text-muted-foreground">{description}</p>
      </div>

      <div className="px-6 space-y-3 flex-1">
        {features.map((feature, index) => (
          <div key={generateArrayKey(index)} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 pt-6 mt-auto">
        <PricingButton variant={buttonVariant} planTitle={title}>
          {buttonText}
        </PricingButton>
      </div>
    </div>
  );
}
