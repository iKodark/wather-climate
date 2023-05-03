import React from 'react'
import AsyncSelect from 'react-select/async';
import { FaWind, FaWater } from 'react-icons/fa'

function App() {
  const [data, setData] = React.useState(null);

  const getData = async ({ latitude, longitude }) => {
    return await fetch(`${import.meta.env.VITE_WEATHER_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
      .then(res => res.json())
      .then(result => result);
  }

  const getOnlyCities = (cities) => cities.filter(city => !!city.population)
  const getImage = (climate) => (
    climate === 'Clear' ?
      '/images/clear.png' :
      climate === 'Rain' ?
        '/images/rain.png' :
        climate === 'Snow' ?
          '/images/snow.png' :
          climate === 'Clouds' ?
            '/images/clouds.png' :
            climate === 'Haze' ?
              '/images/mist.png' :
              ''
  )

  const translateDescription = (climate) => (
    climate === 'Clear' ?
      'Limpo' :
      climate === 'Rain' ?
        'Chuvoso' :
        climate === 'Snow' ?
          'Neve' :
          climate === 'Clouds' ?
            'Muitas nuvens' :
            climate === 'Haze' ?
              'Neblina' :
              ''
  )

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const result = fetch(`${import.meta.env.VITE_GEOCODING_API_URL}/search?name=${inputValue}`)
          .then(response => response.json())
          .then(({ results }) => {
            const result = getOnlyCities(results)
            return result.map((city) => ({ label: `${city.name} - ${city.admin1}`, value: city }))
          })
        resolve(result);
      }, 1000);
    });

  const handleSelect = async ({ value }) => {
    const result = await getData({ latitude: value.latitude, longitude: value.longitude })
    console.log(result)
    const climate = {
      image: getImage(result.weather[0].main),
      description: translateDescription(result.weather[0].main),
      temperature: result.main.temp,
      humidity: result.main.humidity,
      wind: result.wind.speed
    }
    setData(climate)
  }

  const dot = (country) => ({
    alignItems: 'center',
    display: 'flex',
  
    ':after': {
      backgroundImage: `url(https://open-meteo.com/images/country-flags/${country}.svg)`,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
      backgroundSize: '100% 100%'
    },
  });

  const colourStyles = {
    input: (styles, { selectProps }) => ({...styles, ...dot(selectProps?.value?.value?.country_code)}),
  };

  return (
    <div className="flex items-center justify-center bg-slate-900 w-screen h-screen">
      <div className="bg-white p-10 rounded-md w-full md:w-8/12 lg:w-6/12 xl:w-4/12 mx-2">
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          placeholder="Busque sua cidade"
          styles={colourStyles}
          classNames={
            {
              control: () => 'rounded-md w-full p-3'
            }
          }
          noOptionsMessage={() => null}
          loadingMessage={() => 'Buscando...'}
          onChange={handleSelect}
        />
        {!!data && (
          <div className="flex flex-col items-center text-slate-900">
            <img src={data.image} className="w-60 h-auto" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-4xl md:text-6xl mb-2">
                {Math.ceil(data.temperature)}
                <span className="align-super text-base md:text-xl ml-2">ºC</span>
              </span>
              <span className="font-semibold text-3xl md:text-3xl">{data.description}</span>
            </div>
            <div className="flex flex-col md:flex-row w-full items-center md:justify-between mt-5">
              <div className="flex items-center w-1/2 mb-5 md:mb-0">
                <FaWater className="mr-3 text-xl md:text-3xl" />
                <div className="flex flex-col">
                  <span className="font-bold text-3xl">{data.humidity}%</span>
                  <span className="font-semibold">Umidade</span>
                </div>
              </div>
              <div className="flex items-center w-1/2">
                <FaWind className="mr-3 text-xl md:text-3xl" />
                <div className="flex flex-col">
                  <span className="font-bold text-3xl">{data.wind} Km/h</span>
                  <span className="font-semibold">Velocidade do vento</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
