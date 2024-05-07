import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import image from "../assets/growth.png";
// import image3 from "../assets/reflecting.png";
// import image4 from "../assets/looking-ahead.png";

// interface FeatureProps {
//   title: string;
//   description: string;
//   image: string;
// }

const features = [
  {
    title: "Responsive Design",
    description:
      "Responsive dashboard and charts, optimized for laptops, tablets and mobile.",
    // image: image4,
  },
  {
    title: "Branded Colors",
    description: "Use custom colors to create branded content.",
    // image: image3,
  },
  {
    title: "Seamlessly switch chart types",
    description:
      "You can switch between chart types both before and after creating your chart.",
    // image: image,
  },
  {
    title: "Intuitive and easy to use",
    description:
      "It is easy to use NotionPlotter, so you can create beautiful charts without wasting time or effort.",
  },
  {
    title: "Dark/Light theme",
    description: "You can switch between dark and light theme.",
  },
  {
    title: "Reviews",
    description: "You can add reviews to your charts.",
  },
  {
    title: "Features",
    description: "You can add features to your charts.",
  },
  {
    title: "Pricing",
    description: "You can add pricing to your charts.",
  },
  {
    title: "Customizable",
    description: "You can customize your charts to your liking.",
  },
];

const featureList = ["Dark/Light theme", "Reviews", "Features", "Pricing"];

export const Features = () => {
  return (
    <section id="features" className="container  space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Features
        </span>
      </h2>

      {/* <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div> */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <div
                // src={image}
                // alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
