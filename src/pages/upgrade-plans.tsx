import { useState, useEffect } from 'react';
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Check,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import UpgradeButton from "@/components/other/PlanUpgrade";

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const UpgradePlansPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pricingItems = [
    {
      plan: "Weekly",
      // price: PLANS.PRO.price / 4,
      price : 2.99,
      tagline: "For short-term projects.",
      quota: PLANS.PRO.maxDocs,
      features: [
        {
          text: `${PLANS.PRO.maxPagesPerDoc} pages per PDF`,
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: `${PLANS.PRO.maxFileSizePerDoc / (1024 * 1024)}MB file size limit`,
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
    {
      plan: "Monthly",
      price: PLANS.PRO.price,
      tagline: "For ongoing projects.",
      quota: PLANS.PRO.maxDocs,
      features: [
        {
          text: `${PLANS.PRO.maxPagesPerDoc} pages per PDF`,
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: `${PLANS.PRO.maxFileSizePerDoc / (1024 * 1024)}MB file size limit`,
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
    {
      plan: "Yearly",
      price: PLANS.PRO.price * 10,
      tagline: "For long-term savings.",
      quota: PLANS.PRO.maxDocs * 12,
      features: [
        {
          text: `${PLANS.PRO.maxPagesPerDoc} pages per PDF`,
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: `${PLANS.PRO.maxFileSizePerDoc / (1024 * 1024)}MB file size limit`,
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
        {
          text: "Two months free",
          footnote: "Save 16% compared to monthly billing",
        },
      ],
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mb-8 mt-24 text-center max-w-5xl mx-auto opacity-0 transition-opacity duration-500 ease-in-out" style={{ opacity: isLoading ? 0 : 1 }}>
          <div className="mx-auto mb-10 sm:max-w-lg">
            <h1 className="text-6xl font-bold sm:text-7xl">Upgrade Your Plan</h1>
            <p className="mt-5 text-gray-600 sm:text-lg">
              Choose the plan that best fits your needs and take your projects to the next level.
            </p>
          </div>

          <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <TooltipProvider>
              {pricingItems.map(({ plan, price, tagline, quota, features }) => (
                <div
                  key={plan}
                  className={cn("relative rounded-2xl bg-white shadow-lg", {
                    "border-2 border-green-300 shadow-green-300": plan === "Monthly",
                    "border border-gray-200": plan !== "Monthly",
                  })}
                >
                  {plan === "Monthly" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 px-3 py-2 text-sm font-medium text-white">
                    Popular
                  </div>
                  
                  )}

                  <div className="p-5">
                    <h3 className="my-3 text-center font-display text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500">{tagline}</p>
                    <p className="my-5 font-display text-6xl font-semibold">
                      ${price}
                    </p>
                    <p className="text-gray-500">{plan.toLowerCase()}</p>
                  </div>

                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <p>
                        {quota.toLocaleString()} PDFs/
                        {plan === "Yearly" ? "year" : plan.toLowerCase()}
                      </p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          How many PDFs you can upload per {plan.toLowerCase()}.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          <Check className="h-6 w-6 text-blue-500" />
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p className="text-gray-600">{text}</p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p className="text-gray-600">{text}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200" />
                  <div className="p-5">
                    <UpgradeButton plan={plan.toLowerCase()} price={price} />
                  </div>
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default UpgradePlansPage;
