import * as React from "react";

export function PricingIntro() {
  return (
    <div className="flex flex-wrap gap-5 justify-between mt-16 max-w-full w-[942px] max-md:mt-10">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3338053f93410a7552931f6c0939693454ea53d07b86b00a19ff70a6a1ab780c?placeholderIfAbsent=true&apiKey=7c46d4152cd94189a10c5d02dba03ac4"
        className="object-contain shrink-0 self-start w-12 aspect-square"
        alt="Pricing icon"
      />
      <div className="flex flex-col items-center max-md:max-w-full">
        <div className="text-sm leading-loose text-indigo-400 uppercase">
          pricing
        </div>
        <div className="mt-2.5 text-4xl font-bold tracking-tight leading-tight text-center bg-clip-text bg-[linear-gradient(262deg,#F97689_-1.47%,#7186FF_99.32%)]">
          Simple Membership
        </div>
        <div className="self-stretch mt-12 text-2xl font-black leading-none text-center text-gray-200 bg-blend-normal max-md:mt-10 max-md:mr-2 max-md:max-w-full">
          The Framework includes 3 name trials for free !
        </div>
        <div className="flex flex-wrap gap-10 self-stretch px-9 py-2.5 mt-10 text-xl leading-relaxed text-center rounded-2xl bg-zinc-300 bg-opacity-0 max-md:px-5 max-md:mt-10 max-md:max-w-full">
          <div className="flex-auto text-gray-200 bg-blend-normal w-[223px]">
            Already have a subscription ?
          </div>
          <button className="grow shrink self-start w-[132px]">
            Link your accounts
          </button>
        </div>
        <div className="mt-14 text-2xl max-md:mt-10">
          Choose a plan that works for you
        </div>
        <div className="mt-4 text-xl leading-relaxed text-center text-gray-200 bg-blend-normal">
          Get Unlimited trials after subscription !
        </div>
      </div>
    </div>
  );
}