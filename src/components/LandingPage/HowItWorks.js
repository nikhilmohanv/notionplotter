import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

const features = [
  {
    // icon: <MedalIcon />,
    id: "1",
    title: "Connect to Notion",
    desc: "Connect to your Notion workspace to select databases to create charts.",
    image: "/connectdata.png",
  },
  {
    // icon: <MapIcon />,4
    id: "2",
    title: "Create Chart",
    desc: "Create unlimited charts from your database with your choice of chart type, colors, and more. You can filter and sort data as you do in your notion dashboard.",
    image: "/bluehowto.png",
  },
  {
    // icon: <PlaneIcon />,
    id: "3",
    title: "Embed chart",
    desc: "Embed your charts direclty to your Notion dashboard. Copy the link and paste it to your pages.",
    image: "/purplehowto.png",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howitworks" className="container text-center pt-24 pb-4">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        {/* <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text"> */}
        Works {/* </span> */}
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        dolor pariatur sit! */}
      </p>

      <div className="">
        {features.map(({ title, desc, id, image }) =>
          id == "2" ? (
            <div key={id} class="py-16">
              <div class="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
                <div class="bg-gray-50 dark:lg:bg-darker lg:p-16 rounded-[3rem] space-y-6 md:flex md:gap-6 justify-center md:space-y-0 lg:items-center">
                  <div class="md:5/12 lg:w-1/2">
                    <img
                      src={image}
                      alt="image"
                      loading="lazy"
                      width=""
                      className="rounded-xl lg:rounded-[3rem]"
                      height=""
                    />
                  </div>
                  <div class="md:7/12 lg:w-1/2">
                    <h2 class="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                      {title}
                    </h2>
                    <p class="my-8 text-gray-600 dark:text-gray-300">{desc} </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={id} className="mb-12">
              <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
                <div className="lg:bg-gray-50 dark:lg:bg-darker lg:p-16 rounded-[3rem] space-y-6 md:flex flex-row-reverse md:gap-6 justify-center md:space-y-0 lg:items-center">
                  <div className="md:5/12 lg:w-1/2">
                    <img
                      src="/connectdata.png"
                      alt="image"
                      loading="lazy"
                      width=""
                      height=""
                      className="rounded-xl lg:rounded-[3rem]"
                    />
                  </div>
                  <div className="md:7/12 lg:w-1/2">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                      {title}
                    </h2>
                    <p className="my-8 text-gray-600 dark:text-gray-300">
                      {desc}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
