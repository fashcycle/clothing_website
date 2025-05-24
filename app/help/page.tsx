"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function HelpCenter() {

    const faqs = {
        renters: {
          "Before Order": [
            {
              question: "Can I ask the lender questions about an item before renting?",
              answer: "No! You cannot connect directly with the lender.",
            },
          ],
          "Checkout and Payment": [
            {
              question: "What payment methods do you accept?",
              answer: "We accept credit/debit cards, net banking, UPI, and select digital wallets.",
            },
            {
              question: "When is my payment processed?",
              answer: "Payment is processed at checkout and held securely until the rental period begins.",
            },
          ],
          "Shipping and Delivery": [
            {
              question: "How is the item delivered to me?",
              answer: "Items are shipped via our trusted logistics partners. You’ll receive tracking details once shipped.",
            },
            {
              question: "Can I choose a delivery date?",
              answer: "Yes, select your preferred delivery date during checkout.",
            },
          ],
          "Return and Cancellation": [
            {
              question: "How do I return a rented item?",
              answer: "Use the provided return label and packaging. Schedule a pickup or drop-off as per your convenience.",
            },
            {
              question: "What is your cancellation policy?",
              answer: "You can cancel up to 24 hours before the scheduled shipping date for a full refund.",
            },
          ],
          "Authentication and Quality Control": [
            {
              question: "Are rented items authentic and in good condition?",
              answer: "All items undergo strict authentication and quality checks before listing and after each rental.",
            },
          ],
        },
      
        lenders: {
          "Before Order": [
            {
              question: "How do I list my item for rent?",
              answer: "Click “List an Item,” fill in the details, upload photos, we will approve and list your product.",
            },
            {
              question: "Can I set rental terms and conditions?",
              answer: "No, rental terms and condition is consistent over the platform as per platform’s terms and condition.",
            },
          ],
          "Checkout and Payment": [
            {
              question: "When do I receive payment for my rented item?",
              answer: "Payment is released to your account after the rental period is completed and the item is returned in good condition.",
            },
            {
              question: "Are there any platform fees?",
              answer: "A small service fee is deducted from each successful rental to cover platform costs.",
            },
          ],
          "Shipping and Delivery": [
            {
              question: "Who handles shipping?",
              answer: "Logistic and delivery of the product will be handled by us.",
            },
            {
              question: "How do I prepare my item for shipping?",
              answer: "Package the item securely using the materials available to you and follow the shipping instructions sent to you.",
            },
          ],
          "Return and Cancellation": [
            {
              question: "What happens if an item is returned late or damaged?",
              answer: "Late returns or damages may incur additional charges, which are deducted from the renter’s deposit.",
            },
            {
              question: "Can I cancel a rental request?",
              answer: "Yes, you can cancel before the item is shipped, but frequent cancellations may affect your profile.",
            },
          ],
          "Authentication and Quality Control": [
            {
              question: "How do you ensure only authentic items are listed?",
              answer: "Our team reviews and authenticates each item before it goes live on the platform.",
            },
          ],
        },
      
        buyers: {
          "Before Order": [
            {
              question: "How do I know if an item is available for purchase?",
              answer: "Items available for purchase are clearly marked. Use filters to see only items for sale.",
            },
            {
              question: "Can I negotiate the price?",
              answer: "No, negotiation is not allowed. The product prices and commission on the item are consistent across the platform.",
            },
          ],
          "Checkout and Payment": [
            {
              question: "What payment options do you offer?",
              answer: "We accept all major payment methods, including cards, UPI, and wallets.",
            },
            {
              question: "Is my payment secure?",
              answer: "Yes, all transactions are encrypted and processed through trusted payment gateways.",
            },
          ],
          "Shipping and Delivery": [
            {
              question: "How long does delivery take?",
              answer: "Delivery times vary by location and seller. Estimated delivery is shown at checkout.",
            },
            {
              question: "Can I track my order?",
              answer: "Yes, tracking information is provided once your order is shipped.",
            },
          ],
          "Return and Cancellation": [
            {
              question: "What is your return policy for purchases?",
              answer: "No returns are accepted once you have purchased the item.",
            },
            {
              question: "How do I cancel my order?",
              answer: "Orders can be cancelled before they are shipped. Go to your orders page and select “Cancel.”",
            },
          ],
          "Authentication and Quality Control": [
            {
              question: "Are items verified for authenticity?",
              answer: "Yes, all items undergo authentication before being shipped to buyers.",
            },
          ],
        },
      
        sellers: {
          "Before Order": [
            {
              question: "How do I list an item for sale?",
              answer: "Click “List an item,” fill in the details, upload photos and select sell button to sell the product.",
            },
            {
              question: "Are there any listing fees?",
              answer: "Listing is free. A small commission is charged on successful sales.",
            },
          ],
          "Checkout and Payment": [
            {
              question: "When do I get paid for a sale?",
              answer: "Payment is released after the buyer confirms receipt and satisfaction with the item.",
            },
            {
              question: "Can I offer discounts or promotions?",
              answer: "No, you cannot create special offers or discounts from your seller dashboard.",
            },
          ],
          "Shipping and Delivery": [
            {
              question: "Who arranges shipping?",
              answer: "Shipping is arranged by us with the service of our logistic partners.",
            },
            {
              question: "What should I do before shipping?",
              answer: "Ensure the item is clean, in good condition, and packaged securely.",
            },
          ],
          "Return and Cancellation": [
            {
              question: "What happens if a buyer returns an item?",
              answer: "No return policy if item is bought by the user, provided it's in good condition.",
            },
            {
              question: "Can I cancel a sale?",
              answer: "You can cancel before shipping, but frequent cancellations may impact your seller rating.",
            },
          ],
          "Authentication and Quality Control": [
            {
              question: "How do you maintain quality standards?",
              answer: "Every item is inspected for quality and authenticity before being sent to the buyer.",
            },
          ],
        },
      };
      

  return (
    <div className="min-h-screen pt-24 pb-12">
    <div className="container mx-auto px-4">
    <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-4xl mx-auto"
>
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>

      <div className="grid gap-8">
        {/* Frequently Asked Questions */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Tabs defaultValue="renters" className="w-full max-w-5xl mx-auto px-4 md:px-0">
          <TabsList className="grid w-full mb-5 grid-cols-4 gap-4 mb-10 p-2 bg-muted/30 rounded-xl shadow-sm">
        {["renters", "lenders", "buyers", "sellers"].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/40 px-6 py-4 rounded-lg transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold capitalize">{tab}</span>
              <span className="text-xs text-muted-foreground hidden md:block">
                {tab === "renters" && "Rent Fashion Items"}
                {tab === "lenders" && "Lend Your Items"}
                {tab === "buyers" && "Purchase Items"}
                {tab === "sellers" && "Sell Your Items"}
              </span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-12">
      {Object.entries(faqs).map(([role, categories]) => (
        <TabsContent value={role} key={role} className="space-y-8">
          {Object.entries(categories).map(([category, qaList], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="bg-background border rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold mb-5 text-primary">{category}</h3>
              <Accordion type="multiple" className="space-y-4">
                {qaList.map(({ question, answer }, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="border rounded-xl px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <AccordionTrigger className="text-lg font-medium hover:no-underline transition">
                      {question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </TabsContent>
      ))}
      </div>
    </Tabs>
        </section>
        {/* Contact Support */}
        <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="mb-6">Our support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="bg-primary-foreground text-primary px-6 py-2 rounded-md hover:opacity-90 transition">
              Contact Support
            </a>
            <a href="mailto:support@fashcycle.com" className="bg-primary-foreground/10 px-6 py-2 rounded-md hover:bg-primary-foreground/20 transition">
              Email Us
            </a>
          </div>
        </section>
      </div>
    </motion.div>
      </div>
    </div>
  );
}