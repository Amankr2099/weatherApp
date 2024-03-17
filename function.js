const inputField = document.querySelector('#city-input')
const checkButton = document.querySelector('#check-weather')
const locationButton = document.querySelector('#give-location')

const cityname = document.querySelector('#city-name')
const cityTemp = document.querySelector('#temperature')
const tempIcon = document.querySelector('#temp-img')
const maxTemp = document.querySelector('#max-temp')
const minTemp = document.querySelector('#min-temp')
const tempDisc = document.querySelector('#condition')

const weatherStatus = document.querySelector('.weather-status')

const errorBlock = document.querySelector('.error-block')

//set parameters of api url
const impId = "77b4f3bcb3c3ce22a8801e75c74e4975&"
const baseurl = "https://api.openweathermap.org/data/2.5/weather?"
const units = "metric"

const getWeather = async (cityName) => {
    //set url
    const url = baseurl + "q=" + cityName  + "&appid=" + impId + "&units=" + units;

    try {
        //fetch response from api call
        const response = await fetch(url)
        const data = await response.json()

        //hide previous error block(if any)
        errorBlock.style.display = 'none'

        //change text elements
        cityname.innerText = data.name;
        cityTemp.innerText = data.main.temp + '°C';
        tempDisc.innerHTML = data.weather[0].description;
        tempIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        maxTemp.innerHTML = data.main.temp_max + '°C';
        minTemp.innerHTML = data.main.temp_min + '°C';

        //reset input feild
        inputField.value = '';
        inputField.setAttribute('placeholder','Search again');

    } catch (error) {
        //hide weather status
        weatherStatus.style.display = 'none'
        //show error block
        errorBlock.style.display = 'block'
        console.log(error);
    }

}

checkButton.addEventListener('click', () => {
    //take input value
    const cityName = inputField.value;

    if (cityName === '') {                 //check if it's empty
        alert('Please Enter A location')
    }else{
        weatherStatus.style.display = 'block'  //show weather status block
        getWeather(cityName)
    }
})

const getCity = async(bdcURL)=>{
    //fetch city name from latitude and longitude
    try {
        const locationResponse = await fetch(bdcURL);
        const data = await locationResponse.json();
        const cityName = data.city;
        weatherStatus.style.display = 'block'
        getWeather(cityName);
    } catch (error) {
        console.log(error);
    }
}

const getLocation = ()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            const userLatitude = position.coords.latitude;
            const userLogitude = position.coords.longitude;
            //set latitude and longitude
            bdcURL = `https://api-bdc.net/data/reverse-geocode-client?latitude=${userLatitude}&longitude=${userLogitude}&locality`;
            getCity(bdcURL);
        }),
        (err)=>{
            alert(err)
        }
    }else{
        alert('Geolocation Not Supported')
    }
}

locationButton.addEventListener('click',()=>{
    getLocation()
})
