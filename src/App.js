import React ,{useState ,useEffect } from 'react';

import { Select , FormControl , MenuItem ,Card ,CardContent, Typography } from '@material-ui/core';

import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';

import { sortData, prettyPrintStat } from './utils'

import './App.css';
import 'leaflet/dist/leaflet.css';


function App() {
  let [countries, setCountries] = useState([]);
  let [country, setCountry] = useState('worldwide');
  let [countryInfo, setCountryInfo] = useState({});
  let [tableData, setTableData] = useState([]);
  let [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data)
        })
    };

    fetchData()
  },[])

  useEffect(() => {
    const fetchCountriesName = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          // console.log('[data]', data);
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ));
          setMapCountries(data);
          let sortedData = sortData(data);
          console.log(sortedData);
          setCountries(countries);
          setTableData(sortedData);
          
        })

    }

    fetchCountriesName();

  }, []);
  
  const onChangeCountryHandler = async (event) => {
    
    let url = event.target.value === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${event.target.value}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(event.target.value);
        setCountryInfo(data);
        setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long} );
        setMapZoom(4);
        
      })
    
  }
  console.log(casesType);
  
  return (
    <div className="app">
      <div className='app__left'>
        <div className="app__header">
          <FormControl className="app__dropdown">
            <Select varient="outlined" value={country} onChange={onChangeCountryHandler}>
              <MenuItem value='worldwide'> Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value} key={`${country.value} ${country.name}`}>{country.name}</MenuItem>
              ))}
              
            </Select>
          </FormControl>
          <h1>Covid-19 Tracker</h1>
        </div>
      
        <div className='app__stats'>
          <InfoBox isRed
            active={casesType === 'cases'}
            onclick={e => setCasesType('cases')}
            title='CoronaVirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)} />
          
          <InfoBox active = {casesType === 'recovered'}
            onclick={e => setCasesType('recovered')}
            title="Recoverd"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)} />
          
          <InfoBox isRed
            active={casesType === 'deaths'}
            onclick={e => setCasesType('deaths')}
            title='Death'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <Map casesType={casesType} countries = {mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      
      <div className='app__right'>
        <Card className='app__table'>
          <CardContent>
            <h3>Lives cases by countries</h3>
            <Table countriesData={tableData} /> 
            <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
            <LineGraph className='app__graph' casesType={casesType}/>
          </CardContent>
        </Card>
      </div>      
      
    </div>
  );
}

export default App;
