import * as React from "react";

export function PricingCard({ avatarCount, originalPrice, discountedPrice, isWide }) {
  return (
    <div className={`flex flex-col ${isWide ? "w-6/12" : "w-[33%]"} max-md:ml-0 max-md:w-full`}>
      <div className="flex flex-col grow items-center px-16 py-7 w-full font-medium tracking-tight text-center rounded-2xl bg-zinc-300 bg-opacity-20 max-md:px-5 max-md:mt-10">
        <div className="text-base">Download</div>
        <div className="mt-2 text-3xl font-black">{avatarCount} AVATAR{avatarCount > 1 ? 'S' : ''}</div>
        <div className="mt-10 font-black text-white w-[377px]">
          {originalPrice && (
            <span className="text-3xl font-bold text-white line-through">
              C${originalPrice}
            </span>
          )}
          <span className="text-4xl"> C${discountedPrice}</span>
        </div>
        <button className="self-stretch px-16 pt-3 pb-6 mt-11 text-xl whitespace-nowrap rounded-lg border-2 border-white border-solid bg-slate-900 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mt-10">
          SUBSCRIBE
        </button>
      </div>
    </div>
  );
}