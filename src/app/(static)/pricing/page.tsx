import { PricingSection } from "@/components/pricing/pricing-section";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { SignUpButton } from "@/components/app-layout/sign-up-button";

export default async function PricingPage() {
  const { user } = await withAuth();

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Pricing (Coming soon)
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {/* Get started immediately for free. Upgrade for more credits, usage
            and collaboration. */}
            I currently have around $1990 startup credits in GCP so I have
            access to Gemini models. Please feel free to use the gemini models,
            until of course that gets over.
          </p>
        </div>

        <PricingSection />

        {!user && (
          <div className="mt-16 flex flex-col items-center gap-3">
            <div className="text-2xl font-bold">Ready to get started?</div>
            <SignUpButton large />
          </div>
        )}
      </div>
    </div>
  );
}
