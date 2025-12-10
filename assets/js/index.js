// SELEÇAO DOS ELEMENTOS DO DOM 

const form = document.getElementById("search-form");
const inputCity = document.getElementById("city-input");
const loadingBox = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weatherResult = document.getElementById("weather-result");

// Elementos onde serão exibidos os dados da API 

const locationName = document.getElementById("location-name");
const localTime = document.getElementById("local-time");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind")
const pressure = document.getElementById("pressure");
const weatherIcon = document.getElementById("weather-icon");

// Chave da API e URL base

const API_KEY = "6199e0e8461d4c4f98a235620250912";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

// FUNÇÃO PRINCIPAL: buscarClima(cidade)

async function searchWeather(city) {

  errorBox.classList.add("hidden");
  weatherResult.classList.add("hidden");
  loadingBox.classList.remove("hidden");

  console.log("Buscando clima para: ", city);

  // chamada da API
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${city}&lang=pt`;
    
    console.log("URL da requisição", url);

    const response = await fetch(url);

    if (!response.ok){
      throw new Error("Cidade não encontrada!");
    }

    const data = await response.json(); // converte a resposta em JSON
    
    console.log("Dados recebidos da API:" , data);

    showWeather(data);
  } catch (error){

  console.log("Erro: ", error.message);

    errorBox.textContent = error.message;
    errorBox.classList.remove("hidden");

  }finally {

    loadingBox.classList.add("hidden");

  }

// Exibir os dados no site

function showWeather(data){

  const {
    location: {name, country, localtime},
    current: {
      temp_c,
      condition:{ text, icon},
      humidity: hum,
      wind_mph,
      pressure_mb
    }
  } = data;

  // Preencher os elementos HTML

  locationName.textContent = `${name}, ${country}`;
  localTime.textContent = localtime; 
  temperature.textContent = temp_c.toFixed(1);
  description.textContent = text;
  humidity.textContent =hum;
  wind.textContent = wind_mph;
  pressure.textContent = pressure_mb;

  weatherIcon.innerHTML =`<img src="https:${icon}" alt="${text}"/>`;

  weatherResult.classList.remove("hidden");

  console.log("Clima exibido com sucesso! ;)");

}

}


function removeAccents(text){ // função para remover acentos (pois estava tendo erros na localizacao da cidade devido aos acentos)
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g,"")
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); //impede que a página recarregue

  let city = inputCity.value.trim();

  if(city === ""){
    errorBox.textContent = "Digite o nome de uma cidade!";
    errorBox.classList.remove("hidden");
    return;
  }

  city = removeAccents(city);

  searchWeather(city); //chama a função principal 
})

