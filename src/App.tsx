import * as React from "react";

import { Nav } from "./components/Nav";
import { Shortener } from "./components/Shortener";
import { UrlTable } from "./components/UrlTable";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./tailwind.css";

const App = () => {
  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      <Nav />

      <div className="flex flex-col flex-1 px-64 py-10 overflow-hidden">
        <Shortener className="my-12" />

        <UrlTable />
      </div>
    </div>
  );
};

export default App;
