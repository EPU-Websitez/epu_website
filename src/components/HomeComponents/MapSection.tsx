import Image from "next/image";
import React from "react";

const MapSection = () => {
  return (
    <div className="w-full h-[600px] relative">
      <Image src="/images/map.png" alt="map" fill priority />
    </div>
  );
};

export default MapSection;
