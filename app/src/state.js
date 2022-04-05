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

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current.on("mousemove", "states", (e) => {
       // Change the cursor to a pointer when the mouse is move over the states layer.
        map.current.getCanvas().style.cursor = "pointer";

        popup
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.state)
          .addTo(map.current);
      });

      map.current.on("mouseleave", "states", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
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
