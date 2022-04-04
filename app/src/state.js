import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Header from "./Header";

export default function State() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-95.443, 37.6413],
      zoom: 3,
    });
    map.current.on("load", () => {
      map.current.addSource("state", {
        type: "vector",
        url: "mapbox://shalini1297.state",
      });
      map.current.addLayer({
        id: "states",
        type: "fill",
        source: "state",
        "source-layer": "state",

        paint: {
          "fill-color": "rgba(200, 100, 240, 0.4)",
          "fill-outline-color": "rgba(0,0,0, 1)",
        },
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false })
      );
    });
  });

  return (
    <div>
      <Header />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
