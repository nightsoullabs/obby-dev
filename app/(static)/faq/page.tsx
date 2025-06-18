import { FAQSection } from "components/landing/faq/faq-section";

export default function FAQPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about Obby and how it works.
          </p>
        </div>

        <FAQSection />
      </div>
    </div>
  );
}
