import * as React from "react";

import { GoldBellySVG } from "./GoldBelly";

export const Nav = () => {
  return (
    <div
      className="flex items-center px-20 py-5 sticky shadow"
      style={{ backgroundColor: "rgb(0, 170, 210)" }}
    >
      <div>
        <GoldBellySVG />
      </div>

      <div className="text-white text-xl font-extrabold px-20">
        URL Shortener
      </div>
    </div>
  );
};
