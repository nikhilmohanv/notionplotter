import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import LoginButton from "@/components/basic/loginbutton";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="sm:container grid  place-items-center pt-9 sm:pt-20 ">
      <div className="text-center mx-2 sm:mx-10 lg:mx-40 md:mx-20 space-y-6 mt-1">
        <main className="text-4xl  md:text-7xl font-black">
          {/* <h1 className="inline"> */}
          {/* <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text"> */}
          Design
          {/* </span> */} charts {/* </h1>{" "} */}
          from
          {/* <br/> */}{" "}
          <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
            Notion
          </span>{" "}
          quickly.
        </main>

        <p className="text-lg text-muted-foreground ">
          Visualize your Notion databases quickly and easily within minutes.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <LoginButton  text={"Start 7 days trial"} variant={""}/>
        </div>
      </div>
      <Image
        src={"/notion2charts-hero-image.png"}
        width={"1500"}
        height="550"
      />

      {/* Shadow effect */}
      {/* <div className="shadow"></div> */}
    </section>
  );
};
