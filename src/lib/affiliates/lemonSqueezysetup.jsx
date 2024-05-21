import React from "react";
import Script from "next/script";

const LemonAffiliate = () => {
  return (
    <>
      <Script id="lemonSqueezyAffiliateConfig" strategy="beforeInteractive">
        {`window.lemonSqueezyAffiliateConfig = { "store": "notionplotter" };`}
      </Script>
      <Script
        src="https://lmsqueezy.com/affiliate.js"
        strategy="afterInteractive"
        defer
      />
    </>
  );
};

export default LemonAffiliate;
