import React, { useEffect } from "react";

export default function useSorttable() {
  useEffect(() => {
    //adds sorttable script
    const scriptEl = document.createElement("script");
    scriptEl.src = "./sorttable.js";
    scriptEl.async = true;
    document.body.appendChild(scriptEl);
    return () => {
      document.body.removeChild(scriptEl);
    };
  }, []);
}
