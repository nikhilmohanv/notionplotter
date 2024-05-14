import Image from "next/image";
import "./style.css";
import { Button } from "@/components/ui/button";
import { Navbar } from "../LandingPageComponents/Navbar";
import styles from "./styles/Header.module.css";
import Link from "next/link";
import featurestyles from "./styles/Features.module.css";

export default function Test() {
  return (
    <div>
      {/* <header> */}
      {/* <Navbar /> */}
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
      {/* <header className={styles.header}>
        <div className={styles.logo}>SPRING</div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">Features</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">Pricing</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">About</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.auth}>
          <button className={styles.signIn}>Sign In</button>
        </div>
      </header> */}

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
      <section className="flex container  md:rounded-3xl justify-center items-center self-stretch px-16 md:py-5 mt-10  w-full bg-gradient-to-r from-[#F2FBF2] to-[#F5FFF6]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col self-stretch my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Connect to Notion
                </h2>
                <p className="mt-5 leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
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

      <section className="flex container  md:rounded-3xl justify-center items-center self-stretch px-16 md:py-5 mt-10 mb-0 w-full bg-gradient-to-r from-[#F2FBF2] to-[#F5FFF6]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col self-stretch  my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Connect to Notion
                </h2>
                <p className="mt-5 leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
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

      <section className="flex container rounded-3xl mx-2 justify-center items-center self-stretch px-16 md:py-5 mt-10  w-full bg-gradient-to-r from-[#F2FBF2] to-[#F5FFF6]  max-md:px-5  max-md:max-w-full">
        <div className="md:mt-5 mb-5 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[40%] max-md:w-full">
              <img
                src={"/connectdata.png"}
                alt="Main"
                className="grow rounded-3xl right-0 w-full aspect-[1.43] max-md:mt-10 max-md:max-w-full"
              />
            </div>
            <div className="flex flex-col w-[60%]   max-md:w-full">
              <div className="flex flex-col md:ml-6 self-stretch my-auto text-sm font-semibold tracking-tight leading-5 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-5xl font-bold tracking-wide leading-[48px] text-indigo-950 max-md:max-w-full max-md:text-4xl max-md:leading-[46px]">
                  Connect to Notion
                </h2>
                <p className="mt-5 leading-6 text-neutral-500 max-md:mt-5 max-md:max-w-full">
                  Connect your Notion account to access your tables and
                  databases and turn them into charts.
                </p>
              </div>
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
