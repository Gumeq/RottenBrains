import Banner_160x300 from "@/components/ads/Banner_160x300";
import Banner_250x300 from "@/components/ads/Banner_250x300";
import Banner_90x728 from "@/components/ads/Banner_90x728";
import NativeAd from "@/components/ads/Native";
import Native2 from "@/components/ads/Native2";
import React from "react";
const page = () => {
  return (
    <div>
      <p>ADS PAGE</p>
      {/* <Banner_250x300></Banner_250x300>
      <Banner_90x728></Banner_90x728>
      <NativeAd></NativeAd>
      <Native2></Native2> */}
      <Banner_160x300></Banner_160x300>
    </div>
  );
};

export default page;
