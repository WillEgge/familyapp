import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ | FamilyHub",
  description:
    "Frequently asked questions about FamilyHub, your family task management solution.",
};

export default function FAQ() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl flex justify-center items-center flex-col gap-8 mt-16">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-center max-w-2xl">
          Find answers to common questions about FamilyHub and how it can help
          your family.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is FamilyHub?</AccordionTrigger>
            <AccordionContent>
              FamilyHub is a comprehensive family task management platform
              designed to help families organize, assign, and track household
              tasks and responsibilities efficiently.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How much does FamilyHub cost?</AccordionTrigger>
            <AccordionContent>
              FamilyHub offers a free basic plan for families to get started.
              Premium features are available through our subscription plans,
              with pricing details available on our pricing page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I access FamilyHub on mobile devices?
            </AccordionTrigger>
            <AccordionContent>
              Yes, FamilyHub is fully responsive and can be accessed on
              smartphones and tablets through web browsers. We also have native
              mobile apps for iOS and Android for a seamless mobile experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              How many family members can I add to my account?
            </AccordionTrigger>
            <AccordionContent>
              Our free plan allows up to 5 family members. Premium plans offer
              unlimited family members, making FamilyHub suitable for families
              of all sizes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Is my family's data secure?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We prioritize the security and privacy of your
              family's data. FamilyHub uses encryption and follows best
              practices in data protection to ensure your information is safe.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-16">
        <a
          href="/signup"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Sign Up for FamilyHub
        </a>
      </div>
    </div>
  );
}
