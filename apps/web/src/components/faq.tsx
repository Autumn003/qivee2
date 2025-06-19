"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // Shipping & Delivery
  {
    id: "1",
    category: "Shipping & Delivery",
    question: "How long does shipping take?",
    answer:
      "Standard shipping across most parts of India typically takes 3–5 business days. Delivery timelines may vary slightly based on your location and local courier services. International shipping is also available and usually takes 7–14 business days, depending on the destination.",
  },
  {
    id: "2",
    category: "Shipping & Delivery",
    question: "Do you offer free shipping?",
    answer: `We do not offer free shipping at the moment. Shipping charges are calculated based on the number of items in your order.
For 1–2 items: ₹99.99,
3–4 items: ₹199.99,
5–6 items: ₹299.99 and 
More than 6 items: ₹300.00. 
Shipping costs are added at checkout and shown before you place your order.`,
  },
  {
    id: "3",
    category: "Shipping & Delivery",
    question: "Can I track my order?",
    answer:
      'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status by logging into your account and visiting the "My Orders" section.',
  },
  // Returns & Exchanges
  {
    id: "4",
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for unworn items in original condition with tags attached. Items must be returned in original packaging. Refunds are processed within 5-7 business days after we receive your return.",
  },
  {
    id: "5",
    category: "Returns & Exchanges",
    question: "How do I return or exchange an item?",
    answer:
      "To initiate a return or exchange, please email us at help.qivee@gmail.com with your order details. Our team will guide you through the return or exchange process and assist you every step of the way.",
  },
  {
    id: "6",
    category: "Returns & Exchanges",
    question: "Can I exchange for a different size or color?",
    answer:
      "Yes! You can exchange items for a different size or color within 7 days. If there's a price difference, we'll charge or refund the difference accordingly.",
  },
  // Payment & Security
  {
    id: "7",
    category: "Payment & Security",
    question: "What payment methods do you accept?",
    answer:
      "We accept a wide range of payment methods through PhonePe, including: UPI, Credit and Debit Cards (Visa, MasterCard, RuPay, etc.), Net Banking, Wallets supported by PhonePe. We also offer Cash on Delivery (COD) as a payment option for added convenience. All transactions are processed securely.",
  },
  {
    id: "8",
    category: "Payment & Security",
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers. All transactions are processed through secure payment gateways.",
  },
  {
    id: "9",
    category: "Payment & Security",
    question: "Can I save my payment information for future purchases?",
    answer:
      "No, we do not store or save any payment information. All transactions are processed securely through our payment gateway, and you will need to enter your payment details at checkout each time for your safety and privacy.",
  },
  // Account & Orders
  {
    id: "10",
    category: "Account & Orders",
    question: "Do I need an account to place an order?",
    answer:
      "Yes, creating an account is mandatory to place an order. Having an account allows you to track your orders, manage your addresses, manage your wishlist and view your order history easily.",
  },
  {
    id: "11",
    category: "Account & Orders",
    question: "Can I cancel my order?",
    answer:
      "Yes, you can cancel your order as long as it has not been shipped and is still in the processing stage. Simply go to the “My Orders” page in your account and click the “Cancel Order” button next to the relevant order. If you need any help, feel free to contact us at help.qivee@gmail.com.",
  },
  {
    id: "12",
    category: "Account & Orders",
    question: "I forgot my password. How do I reset it?",
    answer:
      'Click on "Forgot Password" on the sign-in page and enter your email address. We\'ll send you a secure link to reset your password. The link expires after an hours for security.',
  },
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const groupedFAQs = categories.reduce(
    (acc, category) => {
      acc[category] = filteredFAQs.filter((item) => item.category === category);
      return acc;
    },
    {} as Record<string, FAQItem[]>
  );

  return (
    <div className="min-h-screen container">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary-foreground mt-8 mb-4 hover:bg-secondary-background/10 px-3 transition-all duration-150 py-1 rounded-full "
      >
        <i className="ri-arrow-left-line text-xl mr-2"></i>
        Back to Home
      </Link>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight ">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground">
            Find answers to common questions about shopping, shipping, returns,
            and more.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <i className="ri-search-line text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-muted-foreground"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-muted-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-muted-foreground md:w-64 bg-primary-background"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* FAQ Content */}
        {selectedCategory === "all" ? (
          // Show all categories
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryFAQs = groupedFAQs[category];
              if (categoryFAQs?.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-primary-foreground/60">
                    {category}
                  </h2>
                  <div className="">
                    {categoryFAQs?.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-muted-foreground overflow-hidden hover:bg-muted-foreground/20 transition-colors duration-150"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-8 text-left flex items-center justify-between"
                        >
                          <span className="font-medium  pr-4">
                            {item.question}
                          </span>
                          <i
                            className={`ri-arrow-down-s-line text-[22px] text-muted-foreground transition-transform ${
                              openItems.includes(item.id)
                                ? "transform rotate-180"
                                : ""
                            }`}
                          ></i>
                        </button>
                        {openItems.includes(item.id) && (
                          <div className="px-6 pb-4">
                            <p className="text-secondary-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show selected category
          <div>
            <h2 className="text-2xl font-semibold  mb-6 pb-2 border-b border-primary-foreground/60">
              {selectedCategory}
            </h2>
            <div className="">
              {filteredFAQs.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-muted-foreground overflow-hidden hover:bg-muted-foreground/20 transition-colors duration-150"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-8 text-left flex items-center justify-between"
                  >
                    <span className="font-medium  pr-4">{item.question}</span>
                    <i
                      className={`ri-arrow-down-s-line text-[22px] text-muted-foreground transition-transform ${
                        openItems.includes(item.id)
                          ? "transform rotate-180"
                          : ""
                      }`}
                    ></i>
                  </button>
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4">
                      <p className="text-secondary-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-chat-3-line text-5xl mx-auto text-muted-foreground"></i>
            <h3 className="text-lg font-medium  mb-2">No FAQs found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any FAQs matching your search. Try different
              keywords or browse all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-primary hover:text-primary/80"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-secondary/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold  mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our customer support team is
            here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:help.qivee@gmail.com"
              className="inline-flex items-center px-6 py-3 border border-muted-foreground rounded-lg hover:bg-secondary font-medium"
            >
              <i className="ri-mail-line text-xl mr-2"></i>
              Email Support
            </Link>
            <Link
              href="https://wa.me/8448820500"
              className="inline-flex items-center px-6 py-3 border border-muted-foreground rounded-lg hover:bg-secondary font-medium"
            >
              <i className="ri-whatsapp-line text-xl mr-2"></i>
              WhatsApp Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
