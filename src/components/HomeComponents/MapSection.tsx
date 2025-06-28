import Image from "next/image";
import React from "react";

const MapSection = () => {
  return (
    <div className="w-full h-[600px] relative">
      <Image src="/images/map.png" alt="map" fill priority />
      <div className="absolute top-1/2 left-10 -translate-y-1/2 bg-white bg-opacity-75">
        <div>slaw</div>
      </div>
    </div>
  );
};

export default MapSection;
