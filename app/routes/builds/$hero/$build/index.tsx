import { useParams } from "@remix-run/react";
import React from "react";

export default function BuildNumber() {
  const { hero, build } = useParams();

  return (
    <div>
      Hero: {hero} Build Number: {build}
    </div>
  );
}
