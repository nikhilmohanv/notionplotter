import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

//   interface FAQProps {
//     question: string;
//     answer: string;
//     value: string;
//   }

const FAQList = [
  {
    question: "What is this tool?",
    answer:
      "This tool is a data visualization application that integrates with Notion, allowing you to create and manage charts using your Notion databases.",
    value: "item-1",
  },
  {
    question: "How do I import my data from Notion?",
    answer:
      "You can easily import your data by connecting your Notion account and selecting the databases and pages you want to import. The import process is quick and straightforward.",
    value: "item-2",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data is secure. We don't store any of your data permanently. We only access the databases you choose to share with us, and all data transmissions are encrypted.",
    value: "item-3",
  },
  {
    question: "Can I sync my data in real-time?",
    answer:
      "Yes, our tool supports real-time synchronization with Notion. Your charts will automatically update whenever there are changes to your connected Notion databases.",
    value: "item-4",
  },
  {
    question: "What types of charts can I create?",
    answer:
      "You can create various types of charts including bar, line, pie, and more. You can customize colors, labels, axes, and legends to fit your needs and preferences.",
    value: "item-5",
  },
  {
    question: "Can I export and embed my charts?",
    answer:
      "Yes, you can export your charts in multiple formats such as PNG, JPEG, and PDF. You can also embed your charts into Notion, websites, blogs, or other applications easily.",
    value: "item-6",
  },
  {
    question: "What are the filtering and sorting options?",
    answer:
      "Our tool provides advanced filtering and sorting options to help you analyze your data more precisely. You can group and aggregate data to derive meaningful insights.",
    value: "item-7",
  },
  {
    question: "Can you make charts in Notion?",
    answer:
      "Notion does not allow you to create charts directly from their platform, but with the Notion API, Notion Plotter helps you create charts.",
    value: "item-8",
  },
  {
    question: "Can you visualize data in Notion?",
    answer:
      "Notion does not have a built-in data visualization tool, but with Notion Plotter you can visualize your data to multiple chart types",
    value: "item-9",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="mailto:nicksnotion@gmail.com"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
