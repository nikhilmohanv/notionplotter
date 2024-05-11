"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

export default function ManageSubscription({
  userId,
  isCanceled,
  currentPeriodEnd,
  updatePaymentMethod,
}) {
  const router = useRouter();

  // If the subscription is cancelled, let the user resume his plan
  if (isCanceled && currentPeriodEnd) {
    if (new Date(currentPeriodEnd).toDateString <= new Date().toDateString) {
      return (
        <div className="flex flex-col justify-between items-center gap-4">
          <p>
            You have cancelled the subscription but you still have access to our
            service until {new Date(currentPeriodEnd).toDateString()}
          </p>
          {/* <Button className="w-full" onClick={handleResumeSubscription}>
          Resume plan
        </Button> */}
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 b-0">
            <div className="">
              <div className="grid grid-cols-1 gap-8">
                <div className="rounded-lg bg-white  shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  Your subscription expired <br />
                  <br />
                  <Button className="w-full">Subscrible</Button>
                  {/* <div className="mt-6 space-y-4"> */}
                  {/* <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Subscription Mode
                                </span>
                                <span className="font-medium">Free trial</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Trial End Date
                                </span>
                                <span className="font-medium">
                                  {new Date(renewsAt).toDateString()}
                                </span>
                              </div> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // If the user is subscribed, let him cancel his plan
  const handleCancelSubscription = async () => {
    try {
      const { message } = await axios.post("/api/payment/cancel-subscription", {
        userId,
      });
      router.refresh();
      alert(message);
      //   toast.success(message);
    } catch (err) {
      //
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className=" md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-2xl font-bold">Billing Details</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Next Due Date
                    </span>
                    <span className="font-medium">
                      {new Date(currentPeriodEnd).toDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subscription
                    </span>
                    <span className="font-medium">$3.99/month</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-2xl font-bold">Manage Subscription</h2>
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleCancelSubscription}
                    className="w-full"
                    variant="outline"
                  >
                    Cancel Subscription
                  </Button>
                  {/* <Button className="w-full" variant="outline">
                    Pause Subscription
                  </Button> */}
                  <Button className="w-full">
                    <Link href={updatePaymentMethod}>
                      Update Payment Information
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col justify-between items-center gap-4">
        <p>You are subscribed to our product. Congratulations</p>
        <Button
          className="bg-red-300 hover:bg-red-500 w-full"
          onClick={handleCancelSubscription}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
