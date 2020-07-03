const API_KEY = "9de2d385245fc483f7722e5c668b366a";
const API_BASE_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

// bind click event to generate button
document.querySelector("#generate").addEventListener("click", generateEntry);

// main action
async function generateEntry() {
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;

  if (!(zip && feelings)) {
    alert("Attention: Please provide both US zip code and your feeling!");
    return;
  }

  try {
    const apiResponse = await fetchWeather(zip);

    const entry = {
      temp: apiResponse.main.temp,
      date: getCurrentDate(),
      feelings: feelings,
    };

    await postEntry("/entry", entry);
    await updateUI();
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

// fetches weather for us zip code from external api
async function fetchWeather(zip) {
  if (zip) {
    const response = await fetch(`${API_BASE_URL}&zip=${zip},us`, {
      method: "GET",
      credentials: "same-origin",
    });
    if (response.status !== 200) {
      throw new Error(
        "No valid response from api! Probably zip code not found!"
      );
    }
    const data = await response.json();
    return data;
  }
}

// posts new entry to node backend
async function postEntry(url, entry) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  if (response.status !== 200) {
    throw new Error("Error while posting entry to node backend!");
  }
  const data = await response.json();
  return data;
}

// updates ui with latest entry from node backend
const updateUI = async () => {
  const entry = await fetchLastEntry();
  document.getElementById("date").innerHTML = entry.date;
  document.getElementById("temp").innerHTML = Math.round(entry.temp) + " °F";
  document.getElementById("content").innerHTML = entry.feelings;
};

// fetches last entry from node backend
async function fetchLastEntry() {
  const response = await fetch("/entry", {
    method: "GET",
    credentials: "same-origin",
  });
  if (response.status !== 200) {
    throw new Error("Error while fetching entry from node backend!");
  }
  const data = await response.json();
  return data;
}

// generates new current date each time function is used
function getCurrentDate() {
  const d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
}
