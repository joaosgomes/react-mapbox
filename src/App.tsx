import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";


//import MapGL, { Source, Layer } from 'react-map-gl';
import Map, {
  Layer,
  MapRef,
  Source,
  FullscreenControl,
  Marker,
} from "react-map-gl";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Polygon,
} from "geojson";
// import * as turf from "@turf/turf";
import styles from "./styles.module.css";
import mapboxgl from "mapbox-gl";
import mockData from "./mockData.json";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN // mapbox token here

interface Marker {
  id: number;
  latitude: number;
  longitude: number;
}

const initialViewState = {
  latitude: 38.3955142,
  longitude: 8.7763978,
  bearing: 0,
  pitch: 0,
  zoom: 1,
  transitionDuration: 100,
};

// const calculateArea = (polygonCoords: any) => {
//   const areaInSquareMeters = turf.area(polygonCoords);
//   return areaInSquareMeters;
// };

// const calculateAreaDiv = (polygonCoords: any) => {
//   const polygonArea = calculateArea(polygonCoords);

//     return (
//       <div>
//         {polygonArea > 0 && (
//           <p>
//             {Math.round(polygonArea * 100) / 100} <br /> m2
//           </p>
//         )}
//       </div>
//     );
// };

function App() {
  const [loading, setLoading] = useState(true);
  const handleLoad = () => {
    setLoading(false);
  };

  const [viewport, setViewport] = useState({});
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        bearing: 0,
        pitch: 0,
        zoom: 11,
        transitionDuration: 100,
      });
    });
  }, []);

  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const getMarkers = async () => {
      try {
        const response = mockData;
        const data = await response;
        setMarkers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getMarkers();

    const timer = setInterval(() => {
      getMarkers();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);//setup (Mount)

  //   return () => {
  //     window.removeEventListener('resize', handleResize); //cleanup code (unMount)
  //   };
  // }, []);

  const [viewports, setViewports] = useState({
    //latitude: 37.7749,
    //longitude: -122.4194,
    latitude: 38.407923,
    longitude: -8.783093,
    zoom: 12,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // const handleResize = () => {
  //   setViewports({
  //     ...viewports,
  //     width: window.innerWidth,
  //     height: window.innerHeight

  //   });
  // };

  const [polygon, setPolygon] = useState([
    [38.414588, -8.786274],
    [38.401439, -8.780158],
    [38.416605, -8.776403],
  ]);

  const [polygonCoords, setPolygonCoords] = useState<Polygon>({
    type: "Polygon",
    coordinates: [
      [
        [-122.4194, 37.7749],
        [-122.4253, 37.7749],
        [-122.4253, 37.7816],

        // [-122.4194, 37.7816],
        // [-122.4194, 37.7749]

      // [38.4079, -8.7830],
      // [38.4079 + 0.01, -8.7830 + 0.01],
      // [38.4079 - 0.01, -8.7830 - 0.01]

      //[38.407705, -8.78412],
      //[38.407066, -8.776138],
     
      //[38.406253, 38.406253]
      
      ],
    ],
  });

  const mapRef = useRef<MapRef>();

  if (mapboxgl.supported()) {
    return (
      <>
        {loading && (
          <div
            style={{
              flex: 1,
              textAlign: "center",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              color: "gray",
            }}
          >
            ...
          </div>
        )}
        <div className="container">
        <Map
          style={{ width: "100%", height: "100vh" }}
          trackResize={true}
          initialViewState={viewports}
          mapStyle="mapbox://styles/mapbox/light-v9"
          onLoad={handleLoad}
          attributionControl={false}
          //mapStyle="mapbox://styles/joaosgomes/clfx98nov00bg01mrqwtbbdfm"
          mapboxAccessToken={MAPBOX_TOKEN}
          onResize={(viewports: any) => setViewports({ ...viewports })}
        >
          <Source id="my-data" type="geojson" data={polygonCoords}>
            <Layer
              id="my-layer"
              type="fill"
              source="my-data"
              paint={{
                "fill-color": "rgba(100,100,100,0.5)",
                "fill-outline-color": "rgba(100,100,100,0.1)",
              }}
            />
            {/* calculateAreaDiv(calculateAreaDiv); */}
          </Source>

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              latitude={marker.latitude}
              longitude={marker.longitude}
            >
              <div>{marker.id}</div>
            </Marker>
          ))}
          {/*<FullscreenControl />*/}
        </Map>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default App;
