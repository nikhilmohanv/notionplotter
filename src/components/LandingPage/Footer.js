import LineChartIcon from "../icons/logo";
import Link from "next/link";
export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl  flex"
          >
            <LineChartIcon className="w-6 h-6 mr-2" />
            Notion Plotter
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow US</h3>

          <div>
            <a
              rel="noreferrer noopener"
              href="https://x.com/nicks_notion"
              className="opacity-60 hover:opacity-100"
            >
              Twitter
            </a>
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Web
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Mobile
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Desktop
            </a>
          </div>
        </div> */}

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Policy</h3>
          <div>
            <Link
              rel="noreferrer noopener"
              href="/terms-service"
              className="opacity-60 hover:opacity-100"
            >
              Terms of Service
            </Link>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="/privacy-policy"
              className="opacity-60 hover:opacity-100"
            >
              Privacy Policy
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="/refund"
              className="opacity-60 hover:opacity-100"
            >
              Refund
            </a>
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Community</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Youtube
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Discord
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Twitch
            </a>
          </div>
        </div> */}
      </section>
      <section className=" dark:bg-gray-800 w-full py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024{" "}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://x.com/nicks_notion"
                className="text-primary transition-all border-primary hover:border-b-2"
              >
                Nicks Notion
              </a>
              . All rights reserved.
            </p>
          </div>
          {/* <nav className="flex space-x-4 md:space-x-6">
            <Link
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 text-sm"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 text-sm"
              href="#"
            >
              Documentation
            </Link>
            <Link
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 text-sm"
              href="#"
            >
              Contact
            </Link>
          </nav> */}
        </div>
      </section>

      {/* <section className="container pb-14 text-center">
        <h3>
          &copy; 2024{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://x.com/nicks_notion"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Nicks Notion
          </a>
        </h3>
      </section> */}
    </footer>
  );
};
