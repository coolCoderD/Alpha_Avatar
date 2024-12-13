import * as React from "react";

export function PricingHeader() {
  return (
    <div className="flex flex-wrap gap-5 justify-between items-start w-full text-3xl font-bold tracking-tight text-center text-white whitespace-nowrap max-md:max-w-full">
      <div className="flex gap-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d0a8ea0e776568820456f717dbecf9c079086123a6256c663f6742a6cda1de1?placeholderIfAbsent=true&apiKey=7c46d4152cd94189a10c5d02dba03ac4"
          className="object-contain shrink-0 w-8 aspect-[0.67]"
          alt="Logo icon"
        />
        <div className="flex gap-4 items-start self-start">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/de3554d2911800b4b40e77aa0ab839329abebab7a922834fa7b8e34f2431ade7?placeholderIfAbsent=true&apiKey=7c46d4152cd94189a10c5d02dba03ac4"
            className="object-contain shrink-0 w-14 aspect-[1.27]"
            alt="Brand logo"
          />
          <div className="basis-auto">Alphavatar</div>
        </div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b6704190645cdb74372b16b8d809f72695f9b74503a4ff5e366b2a87a77effa?placeholderIfAbsent=true&apiKey=7c46d4152cd94189a10c5d02dba03ac4"
        className="object-contain shrink-0 w-12 aspect-square"
        alt="Menu icon"
      />
    </div>
  );
}