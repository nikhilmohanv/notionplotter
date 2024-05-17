import { Button } from "@/components/ui/button";
import { Navbar } from "../../components/LandingPage/Navbar";
import { Star } from "./icons";
export default function Landing() {
  return (
    <div style={{ backgroundColor: "rgb(250, 248, 240)" }}>
      <Navbar />
      <div className="text-center mt-14 md:mt-28 ">
        <div className=" flex justify-center gap-1  md:gap-3 w-22 md:w-full ">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
          <h4 className="scroll-m-20 text-xl font-lg tracking-tight">
            Loved by 1,000,000+ creators
          </h4>
        </div>
        <div className="mt-12 ">
          <h1
            style={{
              //   fontWeight: 700,
              //   fontSize: 90,
              //   lineHeight: 1.1,
              color: "rgb(34 34 34)",
            }}
            className="md:text-8xl md:font-bold text-5xl font-bold"
          >
            Fund your <br /> creative work{" "}
          </h1>
        </div>
        <div className="mb-6 md:mb-14 mt-3 px-3">
          <p className="leading-7 [&:not(:first-child)]:mt-6 font-medium text-base md:text-xl">
            Accept support. Start a membership. Setup a shop. It’s easier than
            you think.
          </p>
        </div>
        <div
          style={{
            transitionDuration: 0.1,
            transitionProperty: "all",
            transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
          }}
          className="px-[40px] h-[65px]"
        >
          <Button
            style={{
              backgroundColor: "rgb(255 221 0)",
              //   fontWeight: 700,
              //   fontSize: 22,
              borderRadius: 400,
            }}
            className="w-60 h-full text-black text-2xl font-semibold md:font-bold "
          >
            Start my page
          </Button>
        </div>
      </div>
      {/* how it works */}
      <div
        className="md:container mx-7 text-left   md:text-center "
        style={{
          color: "rgb(34 34 34)",
        }}
      >
        <div
          className="mt-10 md:mr-0   md:ml-0  "
          style={{ backgroundColor: "white", borderRadius: 50 }}
        >
          <h2 className="pt-16 pb-2 pl-4 text-3xl md:text-6xl font-semibold tracking-tight ">
            Give your audience <br /> an easy way to say thanks.
          </h2>
          <h3 style={{}} className="scroll-m-20  md:px-32 px-10 mt-8 text-xl font-base">
            Buy Me a Coffee makes supporting fun and easy. In just a couple of
            taps, your fans
            <br />
            can make the payment (buy you a coffee) and leave a message.
          </h3>

          <div className="md:mt-14 md:pb-12  flex items-center justify-center">
            <img
              src="https://cdn.buymeacoffee.com/assets/img/homepage/images/posts_v8.png"
              className="max-w-[824px] w-full h-auto"
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      {/* <div className="mt-0 md:mt-64">
        <div className="md:pb-64 md:pt-64 pb-0 pt-32">
          <div className="mx-auto container  rounded-48 md:w-[1128px] text-center lg:w-11/12 md:py-48 md:px-96 md:px-48 rounded-24 pt-24 pb-24 px-5 mx-5">
            <h2 className="mt-0 text-dark text-64 leading-80 md:w-11/12 -tracking-2 md:mx-auto tracking-normal mt-8 mx-0 text-left px-0 leading-35 text-30 w-full text-anim">
              {" "}
              Give your audience an easy way to say thanks.{" "}
            </h2>
          </div>
        </div>
      </div> */}

      {/* pricing */}
      {/* <div className="flex items-center justify-center mt-3">
            <div className=" w-[300px] select-none items-center justify-center relative">
              <div className="rounded-xl relative shadow bg-white px-8 py-3 text-center">
                <div className="my-12">
                  <span className="text-dark text-2xl font-semibold">
                    Pro membership
                  </span>
                  <span className="block text-dark mt-2">$15/month</span>
                </div>
                <div className="mb-12">
                  <div className="flex items-center gap-x-8 mb-6 ">
                    <span className="text-14 text-dark font-cr-regular xs:text-8">
                      Support me on a monthly basis
                    </span>
                  </div>
                  <div className="flex items-center gap-x-8 mb-6 ">
                    <span className="text-14 text-dark font-cr-regular xs:text-8">
                      Support me on a monthly basis
                    </span>
                  </div>
                  <div className="flex items-center gap-x-8 mb-6 ">
                    <span className="text-14 text-dark font-cr-regular xs:text-8">
                      Support me on a monthly basis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
    </div>
  );
}
