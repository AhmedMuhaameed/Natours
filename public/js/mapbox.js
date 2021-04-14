export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWhtZWRtb2hhbWVkYWJkZWxyYWhtYW4iLCJhIjoiY2ttdzU2c3Q1MDl6djJ2cDl5ZmVuNjNjNiJ9.veYrwncuzAIp3nh3xdcjUA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ahmedmohamedabdelrahman/ckmw951ke0nzj17pgiruwggle',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create Marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
