import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

const features = [
  {
    // icon: <MedalIcon />,
    id: "1",
    title: "Connect to Notion",
    desc: "Connect to your Notion workspace to select databases to create charts.",
    image: "/user.png",
  },
  {
    // icon: <MapIcon />,4
    id: "2",
    title: "Create Chart",
    desc: "Create unlimited charts from your database with your choice of chart type, colors, and more. You can filter and sort data as you do in your notion dashboard.",
    image: "/user.png",
  },
  {
    // icon: <PlaneIcon />,
    id: "3",
    title: "Embed chart",
    desc: "Embed your charts direclty to your Notion dashboard. Copy the link and paste it to your pages.",
    image: "/user.png",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        dolor pariatur sit! */}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, desc }) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {/* {icon} */}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
