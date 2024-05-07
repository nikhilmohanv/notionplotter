import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

// enum PopularPlanType {
//   NO = 0,
//   YES = 1,
// }

// interface PricingProps {
//   title: string;
//   popular: PopularPlanType;
//   price: number;
//   description: string;
//   buttonText: string;
//   benefitList: string[];
// }

const pricingList = [
  {
    title: "Pro",
    popular: 0,
    price: 3.99,
    description:
      "",
    buttonText: "Start 7 days trial",
    benefitList: [
      "Unlimited Charts", "24/7 Support", "No branding","Color Customization","Advanced filtering and sorting",
    ],
  },
 
];

export const Pricing = ({handleSignIn}) => {
  return (
    <section id="pricing" className="container pt-20 sm:pt-5">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Unlimited{" "}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-6">
        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
        reiciendis. */}
      </h3>
      <div className="grid flex justify-center justify-items-center  gap-8">
        {pricingList.map((pricing) => (
          <Card
            key={pricing.title}
           className="w-80"
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
               
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button onClick={handleSignIn} className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit) => (
                  <span key={benefit} className="flex">
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
