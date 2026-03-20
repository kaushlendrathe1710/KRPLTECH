import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FAQsSection() {
  return (
    <section id="faqs" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h2 className="text-3xl font-bold md:text-4xl">FAQs</h2>
          <p className="mt-3 text-muted-foreground">Common questions about our process, hosting and payments.</p>
        </div>

        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>How long does a website take?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">Usually 3-7 days.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2">
                <AccordionTrigger>Do you provide hosting?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">Yes we help with domain and hosting setup.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3">
                <AccordionTrigger>Do I need to pay full amount first?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">No, pay after 30-50% work completion.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default FAQsSection;
