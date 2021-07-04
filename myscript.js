let city = document.getElementById('city');
let weather = document.getElementById('weather');
let skies = document.getElementById('skies');
let temp = document.getElementById('temp');
let newLocation = document.getElementById('location')
let markers = [];
let submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    getLocation(city.value)
})

async function getCity(lat, lon) {
    try {
        let city = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=ad1b023e1c8b9afe3f37cd8712dbc7cb`, { mode: 'cors' })
        let translated = await city.json()
        weather.textContent = translated.current.weather[0].main;
        skies.textContent = translated.current.weather[0].description;
        let convert = translated.current.temp;
        convert = (convert - 273.15) * (9 / 5) + 32;
        convert = Math.floor(convert * 10) / 10
        temp.textContent = convert + " degrees F"

    } catch { alert("error") }
}

async function getLocation(place) {
    try {
        
        let data = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' + place + '&APPID=ad1b023e1c8b9afe3f37cd8712dbc7cb', { mode: 'cors' })
        let translated = await data.json();
        x = translated.coord.lat;
        y = translated.coord.lon;
        latlng = { lat: x, lng: y }
        weather.textContent = translated.weather[0].main;
        skies.textContent = translated.weather[0].description;
        let convert = translated.main.temp;
        convert = (convert - 273.15) * (9 / 5) + 32;
        convert = Math.floor(convert * 10) / 10
        temp.textContent = convert + " degrees F"
        displayLocation(x,y)
        initMap(x, y, latlng)
        
    } catch {
        alert("Error")
    }
}




async function initMap(latitude, longitude, marker) {

    let map = await new google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
    });
    
    const infowindow = new google.maps.InfoWindow({
        content: "Use map to see weather in different areas",
      });

    marker = new google.maps.Marker({
        position: marker,
        map: map,
        title: "You Are Here",
    });

    infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });

    markers.push(marker)
    console.log(markers)
    map.addListener('mouseup', () => {
        window.setTimeout(() => {
            clearMarkers()
            moveMarker(marker, map)        
          }, 1000);
    })
}

function clearMarkers(){
        markers.forEach(element => element.setMap(null))
        markers = []
}

function moveMarker(marker, map){

    let r = map.getCenter();
    let s = r.lat()
    let t = r.lng();
    getCity(s,t)
    marker = new google.maps.Marker({
        position: r,
        map,
        title: "You Are Here",
    })
    markers.push(marker)
    console.log(markers)
    displayLocation(s,t)
}
    
async function displayLocation(lat, lon){
    let display = ('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyCoU_W2aNRMwma4sSANygwHghUlDh0HHVk')
    fetch(display)
    .then(response => response.json())
    .then(data => {
        let split = data.plus_code.compound_code.split(" ")
        split.splice(0,1)
        let join = split.join(' ')
        newLocation.textContent = join;
    })
    .catch(error => newLocation.textContent = "Middle of Nowhere")

}

async function getUserLocation() {
    try {
        navigator.geolocation.getCurrentPosition(showPosition);
    } catch {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    let y = position.coords.latitude;
    let z = position.coords.longitude;
    let x = { lat: y, lng: z }
    getCity(y, z)
    displayLocation(y,z)
    initMap(y, z, x)
}
getUserLocation()