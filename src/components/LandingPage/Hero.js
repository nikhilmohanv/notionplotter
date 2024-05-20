import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import LoginButton from "@/components/LandingPage/loginbutton";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="sm:container grid  place-items-center pt-9 sm:pt-20 ">
      <div className="text-center mx-2 sm:mx-10 lg:mx-40 md:mx-18 space-y-6 mt-1">
        <main className="text-4xl sm:text-6xl  md:text-7xl font-black">
          {/* <h1 className="inline"> */}
          {/* <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text"> */}
          Design
          {/* </span> */} charts {/* </h1>{" "} */}
          from{" "}
          <br className="lg:visible md:hidden hidden" />
          {/* <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text"> */}
          <span style={{color:"#F4A261"}}> 
            Notion</span>{" "}
          {/* </span>{" "} */}
          quickly.
        </main>

        <p className="text-lg text-muted-foreground ">
          Visualize your Notion databases quickly and easily within minutes.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <LoginButton text={"Start 7 days trial"} variant={""} />
        </div>
      </div>
      <div className="px-2 mt-4">
        <Image
          src={"/image.png"}
          width={"1500"}
          height="550"
          className="rounded-sm md:rounded-xl shadow-lg "
        />
      </div>
      {/* Shadow effect */}
      {/* <div className="shadow"></div> */}
    </section>
  );
};
