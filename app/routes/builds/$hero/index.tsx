import { useParams } from "@remix-run/react";
import React from "react";

export default function Hero() {
  const { hero } = useParams();
  return <div>Builds for {hero}</div>;
}
