import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import LoginButton from "@/components/basic/loginbutton";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = ({handleSignIn}) => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center pt-10 md:py-10 md:gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Design
            </span>{" "}
            charts
            <br />
          </h1>{" "}
          from{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Notion
            </span>{" "}
            quickly.
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Visualize your Notion databases quickly and easily within minutes.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button onClick={handleSignIn}>Start 7 days trial</Button>{" "}
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards handleSignIn={handleSignIn}/>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
