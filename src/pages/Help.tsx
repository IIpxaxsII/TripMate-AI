import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Mail, MessageCircle } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I create a new trip?",
      answer: "Navigate to the 'Plan' section or use the AI chat to describe your ideal trip. Our AI will help generate a personalized itinerary based on your preferences.",
    },
    {
      question: "Can I edit my generated itinerary?",
      answer: "Yes! All generated itineraries are fully customizable. You can add, remove, or modify activities, change dates, and adjust the schedule to fit your needs.",
    },
    {
      question: "How does mood-based trip suggestion work?",
      answer: "Our AI analyzes your current mood selection and travel preferences to recommend destinations and activities that match how you're feeling. Whether you want relaxation, adventure, or culture, we've got you covered.",
    },
    {
      question: "Is my travel data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your personal information and travel data. Your privacy is our top priority.",
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes! TripMate AI works as a Progressive Web App (PWA), allowing you to access saved trips and essential information even without an internet connection.",
    },
    {
      question: "How do I share my trip with others?",
      answer: "Open any trip and tap the share button. You can share your itinerary via email, social media, or generate a shareable link for your travel companions.",
    },
  ];

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or get in touch with our team
          </p>
        </div>

        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
            />
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Still need help?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 space-y-4 hover-scale cursor-pointer">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help via email within 24 hours
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover-scale cursor-pointer">
              <MessageCircle className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with our AI assistant anytime
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;
