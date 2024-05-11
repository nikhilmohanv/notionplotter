import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
  Card,
  CardHeader,
} from "@/components/ui/card";
import CheckIcon from "@/components/icons/checkicon";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UpgradeButton({ isPro }) {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  useEffect(() => {
    const getCheckoutUrl = async () => {
      try {
        const response = await axios.post("/api/productPurchase", {
          productId: "357049",
        });

        console.log(response.data);
        setCheckoutUrl(response.data.checkoutUrl);
      } catch (error) {
        console.error(error);
      }
    };
    if (!isPro) {
      getCheckoutUrl();
    }
  }, [isPro]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <button id="subscribeButton">Upgrade to Pro</button> */}
        <Button id="subscribeButton" variant="outline">
          Upgrade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* <DialogTitle>Share link</DialogTitle> */}
        </DialogHeader>
        <div id="pricing" className="w-full">
          <div className="grid items-center justify-center gap-1 text-center ">
            <div className="space-y-1">
              <h2 className="text-3xl pb-5 font-bold tracking-tighter md:text-4xl/tight">
                Pro
              </h2>
              {/* <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that fits your needs and
                  budget.
                </p> */}
            </div>
            <div className="flex justify-center">
              <Card className="space-y-4 rounded-lg border-none bg-white">
                {/* <div className="space-y-1">
                  <h3 className="text-2xl font-bold">Pro</h3>
                </div> */}
                <div className="space-y-2">
                  <div className="text-4xl font-bold">$3.99</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per month
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    AI-powered image generation
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Access to template library
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Basic customization tools
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />5 GB
                    storage
                  </li>
                </ul>
                <Button className="w-full">
                  <Link href={checkoutUrl} target="_blank">
                    Start Free Trial
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
