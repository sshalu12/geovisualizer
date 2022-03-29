import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Header from "./Header";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hhbGluaTEyOTciLCJhIjoiY2t6M3c2enhyMGFyNjJwcGRnZzFiZXBmbyJ9.tTTMkQttQI7SWT8D0ljMjw";
export default function Poi() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-73.6971, 40.7175],
      zoom: 10,
    });
    map.current.on("load", () => {
      map.current.addSource("poi", {
        type: "vector",
        url: "mapbox://shalini1297.poi",
      });
      map.current.addLayer({
        id: "points-of-interest",
        type: "circle",
        source: "poi",
        "source-layer": "poi",
        paint: {
          // Mapbox Style Specification paint properties
          "circle-color": "#800080",
          "circle-radius": 5,
        },
      });
    });
  });
  
  return (
    <div>
    <Header />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
