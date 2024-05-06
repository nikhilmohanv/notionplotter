"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Pricing() {
  

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Pricing
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Choose the plan that fits your needs and budget.
          </p>
        </div>
        <div className="flex justify-center">
          <Card className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Perfect for individuals and small teams.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">$9</div>
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
                <CheckIcon className="mr-2 inline-block h-4 w-4" />5 GB storage
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
    </section>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
