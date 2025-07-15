"use client";

import { Bot, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  { question: "How does the 'Hold' feature work?", answer: "When you click 'Hold', the item is reserved for you for 12 hours. The vendor is notified, and the item cannot be purchased by others during this period. After 12 hours, the hold is released." },
  { question: "What are the rental terms?", answer: "Rental terms vary by item and vendor. Please check the product description for specific details on rental duration, deposit requirements, and return policies." },
  { question: "How do I buy a part?", answer: "Click the 'Buy' button to add the part to your cart. You can then proceed to checkout to complete your purchase." },
  { question: "Where do I find the vendor's address?", answer: "The vendor's address is listed on each product page, allowing you to know the location for pickup or service." },
];

export function Chatbot() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Bot />
              <span>Frequently Asked Questions</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
