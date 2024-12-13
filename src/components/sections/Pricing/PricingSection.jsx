import * as React from "react";
import { PricingHeader } from "./PricingHeader";
import { PricingIntro } from "./PricingIntro";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  return (
    <div className="flex overflow-hidden flex-col px-14 pt-10 pb-48 bg-slate-950 max-md:px-5 max-md:pb-24">
      <PricingHeader />
      <PricingIntro />
      
      <div className="self-center mt-9 ml-5 max-w-full w-[828px]">
        <div className="flex gap-5 max-md:flex-col">
          <PricingCard avatarCount={1} discountedPrice={5} isWide={true} />
          <PricingCard avatarCount={5} originalPrice={25} discountedPrice={15} isWide={true} />
        </div>
      </div>
      
      <div className="self-center mt-14 w-full max-w-[1243px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <PricingCard avatarCount={10} originalPrice={50} discountedPrice={20} />
          <PricingCard avatarCount={50} originalPrice={250} discountedPrice={75} />
          <PricingCard avatarCount={100} originalPrice={500} discountedPrice={113} />
        </div>
      </div>
    </div>
  );
}