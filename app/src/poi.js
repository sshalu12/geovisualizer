import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Header from "./Header";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hhbGluaTEyOTciLCJhIjoiY2t6M3c2enhyMGFyNjJwcGRnZzFiZXBmbyJ9.tTTMkQttQI7SWT8D0ljMjw";
export default function Location() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
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

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      map.current.on("mousemove", "points-of-interest", (e) => {
        // Change the cursor to a pointer when the mouse is move over the points-of-interest layer.
        map.current.getCanvas().style.cursor = "pointer";
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const locationData = e.features[0].properties;
        const name = locationData.business_name;
        const address = `${locationData.address}, ${locationData.city}, ${locationData.state}, ${locationData.zip}, ${locationData.country}`;
        const category = `${locationData.category_name} (${locationData.category_id})`;
        popup
          .setLngLat(coordinates)
          .setHTML("<p>" + name + "<br>" + address + "<br>" + category + "</p>")
          .addTo(map.current);
      });

      map.current.on("mouseleave", "points-of-interest", () => {
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
      <Header name="location" />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
