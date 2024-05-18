import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import LoginButton from "../basic/loginbutton";

const pricingList = [
  {
    title: "Pro",
    popular: 0,
    price: 3.99,
    description: "",
    buttonText: "Start 7 days trial",
    benefitList: [
      "Unlimited Charts",
      "24/7 Support",
      "No branding",
      "Color Customization",
      "Advanced filtering and sorting",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container sm:pt-20 mt-10 sm:pt-5">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Unlimited{" "}
        </span>
        Access
      </h2>

      <div className="grid pt-6 flex justify-center justify-items-center  gap-8">
        {pricingList.map((pricing) => (
          <Card key={pricing.title} className="w-80">
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
              <LoginButton text={"Start 7 days trial"} variant={""} />
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
