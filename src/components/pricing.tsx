import { Card, CardContent } from "@/components/ui/card";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { ModalDialog } from "./modal-dialog";
import { Check } from "lucide-react";
import { generateArrayKey } from "@/lib/utils/array-utils";

// Ideally this data would come from a database or API
const plans = [
  {
    name: "Basic",
    teamMembers: 3,
    price: 5,
    currency: "$",
    cadence: "monthly",
    features: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    highlight: false,
  },
  {
    name: "Standard",
    teamMembers: 10,
    price: 10,
    currency: "$",
    cadence: "monthly",
    features: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    highlight: false,
  },
  {
    name: "Enterprise",
    teamMembers: "Unlimited",
    price: 100,
    currency: "$",
    cadence: "yearly",
    features: ["Audit logs", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
    highlight: true,
  },
];

export async function Pricing() {
  const { user } = await withAuth();

  return (
    <div className="flex gap-5 min-w-[50vw]">
      {plans.map((plan) => (
        <div key={plan.name} className="flex-1">
          <Card className={`p-6 ${plan.highlight ? "border-blue-500" : ""}`}>
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-0">
                  <h3
                    className={`text-xl font-medium ${
                      plan.highlight ? "text-blue-600" : ""
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.teamMembers} team members
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">
                    {plan.currency}
                    {plan.price}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      per month,
                    </span>
                    <span className="text-sm text-muted-foreground">
                      billed {plan.cadence}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {plan.features.map((feature, index) => (
                    <div
                      key={generateArrayKey(index)}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                {user && (
                  <ModalDialog subscriptionLevel={plan.name} userId={user.id} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
