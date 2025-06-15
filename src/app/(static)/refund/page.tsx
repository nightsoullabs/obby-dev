export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
              Refund Policy
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              This Refund Policy outlines the conditions under which refunds are
              granted for paid plans on Obby ("we," "us," "our," or the
              "Service"). By subscribing to and using Obby, you agree to this
              Refund Policy.
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              <strong>Effective Date:</strong> June 10, 2025
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. Free Trial Period
                </h2>
                <p className="mb-4">
                  We offer a 10-day free trial to all new users for paid plans.
                  During this period:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You will have full access to the features of your chosen
                    plan without charge.
                  </li>
                  <li>
                    You will receive an email notification at the email address
                    provided during signup before your trial ends, informing you
                    of the upcoming charge.
                  </li>
                  <li>
                    If you do not cancel your plan before the trial ends, you
                    will be automatically charged the subscription fee for the
                    chosen plan.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. Eligibility for Refunds
                </h2>
                <p className="mb-4">
                  Refunds are only available under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Request Timing:</strong> You request a refund within
                    7 days of the first payment after the free trial period.
                  </li>
                  <li>
                    <strong>Usage Restrictions:</strong> You have not used the
                    app significantly (beyond the initial week of the paid
                    plan).
                  </li>
                </ul>
                <p>
                  Refund requests outside these conditions will not be honored
                  due to the high operational costs of providing our Service,
                  including AI model usage and infrastructure expenses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  3. Refund Process
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    To request a refund, contact us at support@obby.dev with the
                    subject line "Refund Request" and include your account
                    details and reason for the request.
                  </li>
                  <li>
                    Eligible refunds will be processed within 10 business days
                    after approval.
                  </li>
                  <li>
                    Refunds will be issued to the original payment method used
                    for the subscription purchase.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. Cancellations
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You can cancel your subscription at any time. Subscriptions
                    can be easily managed or canceled directly through the Obby
                    dashboard.
                  </li>
                  <li>
                    <strong>No Refund Upon Cancellation:</strong> If you cancel
                    your subscription after the refund eligibility period, you
                    will not receive a refund for any unused portion of the
                    billing cycle.
                  </li>
                  <li>
                    Upon cancellation, you will retain access to paid features
                    until the end of your current billing period.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Chargebacks</h2>
                <p className="mb-4">
                  <strong>Contact Us First:</strong> Before initiating a
                  chargeback, please contact our support team at
                  support@obby.dev. We are committed to resolving any billing
                  issues or concerns you may have and will work with you to find
                  a satisfactory solution.
                </p>
                <p className="mb-4">
                  Chargebacks are strongly discouraged and considered a breach
                  of our terms. If a chargeback is initiated without first
                  contacting our support team:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Your account will be permanently disconnected from the
                    Service.
                  </li>
                  <li>
                    We reserve the right to take further action to recover the
                    chargeback amount and associated costs.
                  </li>
                  <li>
                    Any generated code or projects associated with your account
                    may become inaccessible.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Changes to This Refund Policy
                </h2>
                <p>
                  We reserve the right to modify this Refund Policy at any time.
                  Changes will be effective upon posting on this page. Continued
                  use of the Service after changes are posted constitutes your
                  acceptance of the updated Policy. We will notify users of
                  significant changes via email or through the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                <p className="mb-2">
                  If you have any questions or concerns about this Refund
                  Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Email: support@obby.dev</li>
                  <li>Representative: Sree Narayanan</li>
                  <li>
                    Social:{" "}
                    <a
                      href="https://x.com/eersnington"
                      className="text-primary hover:underline"
                    >
                      x.com/eersnington
                    </a>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  We are committed to providing excellent customer service and
                  will respond to all inquiries within 24 hours during business
                  days.
                </p>
              </section>

              <div className="border-t pt-8 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> June 10, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
