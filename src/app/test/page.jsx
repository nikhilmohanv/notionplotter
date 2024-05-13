import Image from "next/image";
import "./style.css";
import { Button } from "@/components/ui/button";
import { Navbar } from "../LandingPageComponents/Navbar";

export default function Test() {
  return (
    <div>
      {/* <header> */}
      <Navbar />
      {/* <nav className="head">
          <div>
            <a className="logo">
              <i>SPRING</i>
            </a>
          </div>
          <div>
            <ul>
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="">Features</a>
              </li>
              <li>
                <a href="">Pricing</a>
              </li>
              <li>
                <a href="">About</a>
              </li>
              <li>
                <a href="">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <a href="login.html">Sign In</a>
            <Button>Try free</Button>
           
          </div>
        </nav> */}

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

      {/* <section id="benefits">
        <h3>Key Benefits of Our</h3>
        <h3 className="bold">SaaS Analytics</h3>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          ipsam nostrum totam. Dolore consequatur dolorem unde architecto illo
          earum, quae perferendis voluptas maiores neque sunt culpa, quasi ea
          modi veritatis?
        </p>
        <div className="boxes">
          <div className="big">
            <h4>Data Visualization</h4>
            <p>Total data:</p>
            <h6>1234</h6>
            <Image
              src="/datavisualization.jpeg"
              alt=""
              width="270"
              height="170"
            />
          </div>
          <div className="middle">
            <div className="small">
              <h4>Data Integration</h4>
              <Image src="/qr.jpeg" alt="" width={"250"} height={"80"} />
            </div>
            <div className="small">
              <p>Total data:</p>
              <h6>1234</h6>
              <Image
                src="/dataintegration.jpeg"
                alt=""
                width={"250"}
                height={"80"}
              />
            </div>
          </div>
          <div className="big">
            <h4>Real-time Analytics</h4>
            <p>Total data:</p>
            <h6>1234</h6>
            <Image src="/real-time.jpeg" alt="" width="270" height="170" />
          </div>
        </div>
      </section> */}

      <section id="how">
        {/* <h3>
          How Our <b>Analytics</b>
        </h3>
        <h3>SaaS Works</h3> */}
        {/* <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          ipsam nostrum totam. Dolore consequatur dolorem unde architecto illo
          earum, quae perferendis voluptas maiores neque sunt culpa, quasi ea
          modi veritatis?
        </p> */}
        {/* #D8F4D6 */}
        <div className="">
          <div className="one grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-r from-[#F5FFF6]  to-[#F2FBF2]">
            <div className="left">
              <h4 className="text-6xl">Connect your data from Notion</h4>
              <p className="text-xl	">
              Connect to your Notion workspace to select databases to create charts.
              </p>
            </div>
            <div className="right">
              <div>
                <Image
                  src="/connectdata.png"
                  alt=""
                  width="250"
                  height="200"
                  // className="mr-2"
                  style={{ borderRadius: 16, margin: 50 }}
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
      </section>
    </div>
  );
}
