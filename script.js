document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([18.2208, -66.5901], 9);
    let municipios = [];
    let correctlyIdentified = [];
    let currentMunicipio = null;
    let timerInterval;
    let startTime; // Start time of the stopwatch
    let totalTime = 0; // Total time taken for all correct guesses
    let countdownTimeout; // Timeout for the correct message display

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load GeoJSON data and initialize the game
    fetch('municipalities.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            municipios = data.features;
            console.log("GeoJSON data loaded:", municipios); // Debug log
            L.geoJSON(data, {
                style: feature => ({
                    color: "white", // White outline
                    fillColor: "black",
                    weight: 1,
                    fillOpacity: 1
                }),
                onEachFeature: (feature, layer) => {
                    layer.on({
                        click: (e) => checkMunicipio(e, feature)
                    });
                }
            }).addTo(map);
            startGame();
        })
        .catch(error => {
            console.error("Failed to load GeoJSON:", error); // Error log
        });

    // Function to start the game
    function startGame() {
        setNextMunicipio();
        startStopwatch();
    }

    // Function to start the stopwatch
    function startStopwatch() {
        startTime = Date.now(); // Capture start time
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            document.getElementById('timer').innerText = (elapsedTime / 1000).toFixed(3);
        }, 1);
    }

    // Function to reset the stopwatch
    function resetStopwatch() {
        clearInterval(timerInterval);
        document.getElementById('timer').innerText = "0.000";
        startStopwatch();
    }

    // Function to set the next municipality to identify
    function setNextMunicipio() {
        const remainingMunicipios = municipios.filter(municipio => !correctlyIdentified.includes(municipio.properties.NAME));
        if (remainingMunicipios.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingMunicipios.length);
            currentMunicipio = remainingMunicipios[randomIndex];
            console.log("Next municipio:", currentMunicipio); // Debug log
            document.getElementById('municipio-name').innerText = currentMunicipio.properties.NAME;
            document.getElementById('message').innerText = ""; // Clear any previous message
        } else {
            // All municipalities identified, show winning message
            clearInterval(timerInterval);
            document.getElementById('municipio-name').innerText = "";
            document.getElementById('message').innerText = "You win! All municipalities have been identified.";
            alert(`Congratulations! You've identified all municipalities. Total Time: ${(totalTime / 1000).toFixed(3)} seconds`);
            resetGame(); // Reset the game
        }
    }

    // Function to check if a municipality is correctly identified
    function checkMunicipio(e, feature) {
        const layer = e.target;
        if (!correctlyIdentified.includes(feature.properties.NAME)) {
            console.log("Clicked feature:", feature); // Debug log
            if (currentMunicipio && feature.properties.NAME === currentMunicipio.properties.NAME) {
                const elapsedTime = Date.now() - startTime;
                totalTime += elapsedTime; // Add the elapsed time to the total time
                document.getElementById('total-time').innerText = (totalTime / 1000).toFixed(3); // Update total time display

                layer.setStyle({
                    fillColor: "green",
                    fillOpacity: 1
                });
                correctlyIdentified.push(feature.properties.NAME);
                document.getElementById('message').innerText = `Correct! Time: ${(elapsedTime / 1000).toFixed(3)} seconds`;
                clearTimeout(countdownTimeout);
                countdownTimeout = setTimeout(() => {
                    resetWrongGuesses();
                    setNextMunicipio();
                    resetStopwatch(); // Reset the stopwatch for the next round
                }, 3000); // 3-second delay before resetting
            } else {
                layer.setStyle({
                    fillColor: "red",
                    fillOpacity: 1
                });
            }
        }
    }

    // Function to reset wrong guesses back to black
    function resetWrongGuesses() {
        map.eachLayer(layer => {
            if (layer.feature && layer.feature.properties && !correctlyIdentified.includes(layer.feature.properties.NAME)) {
                layer.setStyle({
                    fillColor: "black",
                    fillOpacity: 1
                });
            }
        });
    }

    // Function to reset the game
    function resetGame() {
        clearInterval(timerInterval);
        correctlyIdentified = [];
        totalTime = 0; // Reset total time
        document.getElementById('timer').innerText = "0.000";
        document.getElementById('total-time').innerText = "0.000";
        document.getElementById('message').innerText = "";
        map.eachLayer(layer => {
            if (layer.feature && layer.feature.properties) {
                layer.setStyle({
                    fillColor: "black",
                    fillOpacity: 1
                });
            }
        });
        setNextMunicipio();
        startStopwatch();
    }
});
