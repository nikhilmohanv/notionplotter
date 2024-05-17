import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Sync from "../icons/landingpage/realtimesync";
import Import from "../icons/landingpage/import";
import Secure from "../icons/landingpage/security";
import ChartType from "../icons/landingpage/charttype";
import Filter from "../icons/landingpage/filter";
import Export from "../icons/landingpage/export";

const features = [
  {
    title: "Easy Data Import",
    description:
      "Effortlessly import your databases and pages from Notion with a few clicks.",
    image: Import,
  },
  {
    title: "Real-Time Sync",
    description:
      "Keep your charts updated with the latest data from Notion automatically.",
    image: Sync,
  },
  {
    title: "Secure",
    description:
      "We don't store any of your data, we only have access to the databases you decide to share with us.",
    image: Secure,
  },
  {
    title: "Seamlessly switch chart types",
    description:
      "Choose from bar, line, pie, and other chart types to visualize your data. Adjust colors, labels, axes, and legends to match your preferences and brand.",
    image: ChartType,
  },
  {
    title: "Filtering and Sorting",
    description:
      "Advanced options to filter and sort data for precise analysis. Group and aggregate data to derive meaningful insights.",
    image: Filter,
  },
  {
    title: "Export and Embed your Charts",
    description:
      "Export charts as PNG, JPEG, PDF, and other formats. Embed your charts in Notion, websites, blogs, or applications with ease.",
    image: Export,
  },
];

export const Features = () => {
  return (
    <section id="features" className="container space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Features
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image: Image }) => (
          <Card key={title}>
            <CardHeader>
              <div className="flex items-center">
                <div className="mr-2">
                <Image />
                </div>
                <CardTitle>{title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
