import Image from "next/image";
import "./style.css";
import { Button } from "@/components/ui/button";
import { Navbar } from "../LandingPageComponents/Navbar";

export default function Test() {
  return (
    <div>
      <section id="home">
        <div className="header  text-center">
          <h1>
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Design
            </span>{" "}
            charts from
          </h1>
          <h1 className="bold">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Notion
            </span>{" "}
            quickly.
          </h1>
          <p className="text-xl text-muted-foreground mt-2 mb-4  lg:mx-0">
            Visualize your Notion databases quickly and easily within minutes.
          </p>
          <Button className="rounded-xl">Get Started</Button>
          {/* <a href="">Get Started</a> */}
        </div>
        <div className="main">
          <Image
            src="/notion2charts-hero-image.png"
            width={"1500"}
            height="550"
            alt=""
          />
        </div>
      </section>

      <section className="flex container  md:rounded-3xl justify-center items-center self-stretch px-16 md:py-5 mt-10  w-full bg-gradient-to-r from-[#F2FBF2] to-[#F5FFF6]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col self-stretch my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Connect to Notion
                </h2>
                <p className="mt-5 md:pr-14 text-lg leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
                  Connect your Notion account to access your tables and
                  databases and turn them into charts.
                </p>
              </div>
            </div>
            <div className="flex flex-col w-[40%] max-md:w-full">
              <img
                src={"/connectdata.png"}
                alt="Main"
                className="grow rounded-3xl right-0 w-full aspect-[1.43] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex container rounded-3xl  justify-center items-center self-stretch px-16 md:py-5 mt-10  w-full bg-gradient-to-r from-[#F0FFFF] to-[#F4FFFF]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[40%] max-md:w-full">
              <img
                src={"/bluehowto.png"}
                alt="Main"
                className="grow md:block hidden rounded-3xl right-0 w-full aspect-[1.43] max-md:mt-10 max-md:max-w-full"
              />
            </div>
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col md:ml-6 self-stretch my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Visualize data with powerful charts
                </h2>
                <p className="mt-5 md:pr-14 text-lg leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
                  Visualize your data in a variety of ways thanks to a robust
                  set of visualizations.
                  {/* Whether it’s as a table, a chart, or a
                  single value — you’re in control. */}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:w-0 max-md:w-full">
              <img
                src={"/bluehowto.png"}
                alt="Main"
                className="grow block md:hidden rounded-3xl right-0 w-full aspect-[1.43] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex container  md:rounded-3xl justify-center items-center self-stretch px-16 md:py-5 mt-10 mb-0 w-full bg-gradient-to-r from-[#F2F1F8] to-[#F7F6FD]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col self-stretch  my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Embed your chart
                </h2>
                <p className="mt-5 md:pr-14 text-lg leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
                  Embed your charts direclty to your Notion dashboard. Copy the
                  link and paste it to your pages.
                </p>
              </div>
            </div>
            <div className="flex flex-col w-[40%] max-md:w-full">
              <img
                src={"/purplehowto.png"}
                alt="Main"
                className="grow rounded-3xl right-0 w-full aspect-[1.43] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <br />
      <br />
      {/* <section id="how">
        <div className="">
          <div className="one grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-r from-[#F2FBF2] to-[#F5FFF6]  md:mx-24  rounded-3xl">
            <div className="left flex items-center justify-center">
              <h4 className="text-6xl">
                Connect your data <br /> from Notion
              </h4>
              <p className="text-xl	m-0">
                Connect to your Notion workspace to select databases to create
                charts.
              </p>
            </div>
            <div className="right mr-10 my-10">
              <div>
                <Image
                  src="/connectdata.png"
                  alt=""
                  className="w-96 rounded-3xl"
                  width="200"
                  height="200"
                  style={{ borderRadius: 16 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="two">
          <div className="left">
            <Image src="/deptmonitoring.jpeg" width="270" height="170" alt="" />
          </div>
          <div className="right">
            <h4>
              Advance Tracking <br />
              In Dept Monitoring
            </h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
              laudantium quaerat vel consequuntur modi officia pariatur quo, non
              rerum repellat unde obcaecati aperiam quos eaque doloribus
              corporis nesciunt ipsum error?
            </p>
          </div>
        </div>
        <div className="one three">
          <div className="left">
            <h4>
              Real Time
              <br />
              Analytics With
              <br />
              User Journey
            </h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
              laudantium quaerat vel consequuntur modi officia pariatur quo, non
              rerum repellat unde obcaecati aperiam quos eaque doloribus
              corporis nesciunt ipsum error?
            </p>
          </div>
          <div className="right">
            <Image width="270" height="170" src="/realtime.jpeg" alt="" />
          </div>
        </div>
      </section> */}
    </div>
  );
}
