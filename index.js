const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const config = require('./config.js')
const { Console } = require('console')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))


// Functions

function PullInfo(location) {
    return new Promise((callback)  => {
        axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apikey}`)
        .then(response => {
            const Data = response.data
            callback(Data.days[0])
            return
        })
        .catch(error => {
            console.error("Error fetching data: ", error)
            callback('Puudub')
            return
        })
    })
}

function FahrenHeitToCelsius(temp) {
    return new Promise((callback) => {
        let celsius = (Math.floor(temp) - 32) * 5/9
        let RoundedCelsius = Math.round(celsius * 100) / 100
        callback(RoundedCelsius)
    })
}

async function ProccessData(city, country) {
    try {
        const Data = await PullInfo(city, country);
        if (Data === "Puudub") {
            return "puudub"
        }
        const CurrentTemperature = await FahrenHeitToCelsius(Data.temp);
        const FeelsLike = await FahrenHeitToCelsius(Data.feelslike);
        
        const Humidity = Data.humidity;
        const Condition = Data.conditions;
        const Description = Data.description;

        const CurrentCity = String(city).charAt(0).toUpperCase() + String(city).slice(1);
        
        const CurrentCountry = country;

        return {
            CurrentCity,
            CurrentCountry,
            CurrentTemperature,
            FeelsLike,
            Humidity,
            Condition,
            Description
        };
    } catch (error) {
        console.error("Error processing data:", error);
        throw error;
    }
}


app.get('/city/:city/country/:country', async(req, res) =>{
    const WeatherData = await ProccessData(req.params.city, req.params.country)
    
    res.render('index', {data:WeatherData})
})

// App
app.get('/', async(req, res) => {
    const WeatherData = await ProccessData("london", "uk")
    res.render('index', {data:WeatherData})
})

app.listen(3002, () => {
    console.log("Listening on 3002")
})