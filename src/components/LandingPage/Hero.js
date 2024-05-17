import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import LoginButton from "@/components/basic/loginbutton";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = ({ handleSignIn }) => {
  return (
    <section className="sm:container grid  place-items-center pt-9 sm:pt-20 ">
      <div className="text-center mx-2 sm:mx-10 lg:mx-40 md:mx-20 space-y-6 mt-1">
        <main  className="text-4xl  md:text-7xl font-black">
          {/* <h1 className="inline"> */}
            {/* <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text"> */}
              Design
            {/* </span> */}
            {" "}
            charts
          {" "}
          {/* </h1>{" "} */}
          from
          {/* <br/> */}
          {" "}
          <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
            Notion
          </span>{" "}
          quickly.
        </main>

        <p className="text-lg text-muted-foreground ">
          Visualize your Notion databases quickly and easily within minutes.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button onClick={handleSignIn}>Start 7 days trial</Button>{" "}
        </div>
      </div>

      {/* Hero cards sections */}
      {/* <div className="z-10">
        <HeroCards handleSignIn={handleSignIn}/>
      </div> */}

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
