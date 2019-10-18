// const callback = (results, status) => {
//   console.log(results);
//   console.log(status);
// };

// const getLocation = () => {
//   const geocoder = new google.maps.Geocoder();
//   const address = { address: "1045 mission street san fransico" };

//   const results = geocoder.geocode(address, callback);
// };

export const getStopAndSearch = async (lat: number, long: number, date: string): Promise<any> => {
  const response = await fetch(
    `https://data.police.uk/api/stops-street?lat=${lat}&lng=${long}&date=${date}`
  );
  return await response.json();
};

let glat: number = 51.6222752;
let glong: number = -0.2787604;

const addSasMarkers = (lat: number, long: number, date: string) => {
  getStopAndSearch(lat, long, date).then(data => {
    const loc = { lat: lat, lng: long };
    const map = new google.maps.Map(document.getElementById("map"), { zoom: 14, center: loc });

    data.forEach(sas => {
      const loc = { lat: Number(sas.location.latitude), lng: Number(sas.location.longitude) };

      let icon = "";
      if (sas.legislation.includes("Drugs")) {
        icon = "/assets/drugs.png";
      } else if (sas.legislation.includes("Firearms")) {
        icon = "/assets/gun.png";
      } else {
        icon = "/assets/pig.jpg";
      }

      const marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: sas.legislation,
        animation: google.maps.Animation.DROP,
        icon: icon
      });
    });
    google.maps.event.addListener(map, "click", function(event) {
      glat = event.latLng.lat();
      glong = event.latLng.lng();
      addSasMarkers(glat, glong, "2019-01");
    });
  });
};

$(document).ready(function() {
  $("#date").attr("value", "2019-01");
  $("#date").attr("min", "2017-01");

  addSasMarkers(
    glat,
    glong,
    $("#date")
      .val()
      .toString()
  );
});

$("#date").change(function() {
  addSasMarkers(
    glat,
    glong,
    $("#date")
      .val()
      .toString()
  );
});
