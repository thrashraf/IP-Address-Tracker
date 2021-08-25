const input             = document.querySelector('input');
const searchIpButton    = document.querySelector('button');
const currentIpAddress  = document.querySelector('.ipAddress');
const currentLocation   = document.querySelector('.location');
const currentTimeZone   = document.querySelector('.timeZone');
const currentIsp        = document.querySelector('.isp');


let lat;
let lng;
let ipAddress;
let locate;
let timeZone;
let isp;

// ? this is to load map from leaflet library
const mymap = L.map('mapid').setView([4.2105 , 101.9758], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 3
}).addTo(mymap);


//? getRequest function
const getRequest = async(url) => {

        return fetch(url).then( res => {

        if (res.status >= 200 && res.status <= 300) {
            return res.json();
        } else {

            return res.json().then(errData => {
                console.log(errData);
                throw new Error('something goin nuts');
            });
        }
        
    }).catch(err => {
        console.log(err);
        throw new Error ('your internet connection is goin nuts');
    });
};


//? this is to get client ip address 
const getIpAddress = async() => {
    try {
        const data = await getRequest('https://api.ipify.org?format=json');
        const ip = data.ip.toString();
        console.log(ip);
        input.value = ip;
        getGeoLocation(ip);
        
    } catch (error) {
        alert(error.message);
    }

};

//? this is to get client geolocation detail 
const getGeoLocation = async(ip) => {
    try {
      
        const geoData = await getRequest(`https://geo.ipify.org/api/v1?apiKey=at_XN3W4lPAL1BdazDkVUqRlf0fAMzKd&ipAddress=${ip}`);
        console.log(geoData);
        lat = geoData.location.lat;
        lng = geoData.location.lng;
        ipAddress = geoData.ip;
        locate = geoData.location.region;
        timeZone = geoData.location.timezone;
        isp = geoData.isp;
    
        console.log(lat);
    } catch (error) {
        
        alert(error.message);
    }    
};

getIpAddress();


//? this is to search function
const searchIp = (e) => {

    if (e.target.tagName === 'BUTTON') {
        // console.log('click');

        //* this is to set view client location
        mymap.setView(new L.LatLng(lat, lng), 10);
        //* this is to set marker on client location
        L.marker([lat, lng]).addTo(mymap)
        .bindPopup(`${ipAddress} location`)
        .openPopup();

        currentIpAddress.innerHTML = ipAddress;
        currentLocation.innerHTML = locate;
        currentTimeZone.innerHTML = timeZone;
        currentIsp.innerHTML = isp;
    }   
};

searchIpButton.addEventListener('click', searchIp);