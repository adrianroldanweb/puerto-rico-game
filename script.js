document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([18.2208, -66.5901], 9);
    let municipios = [];
    let correctlyIdentified = [];
    let currentMunicipio = null;
    let timerInterval;
    let startTime; // Start time of the stopwatch
    let totalTime = 0; // Total time taken for all correct guesses
    let countdownTimeout; // Timeout for the correct message display

    // Description of every municipality 
    const municipiosData = {
        "Adjuntas": {
            "description": "Conocida como la 'Ciudad del Gigante Dormido,' Adjuntas es famosa por su clima fresco y la producción de café."
        },
        "Aguada": {
            "description": "Aguada es conocida por sus hermosas playas y puntos de surf, siendo un destino popular para los amantes del mar."
        },
        "Aguadilla": {
            "description": "Aguadilla es famosa por sus impresionantes playas, como Crash Boat, y es un lugar destacado para surfistas."
        },
        "Aguas Buenas": {
            "description": "Aguas Buenas, a menudo llamada la 'Ciudad de las Aguas Claras,' es reconocida por su entorno natural y clima agradable."
        },
        "Aibonito": {
            "description": "Famoso por su festival anual de flores, Aibonito es un lugar con paisajes exuberantes y un clima fresco."
        },
        "Añasco": {
            "description": "Añasco tiene una rica historia y una costa hermosa a lo largo del Pasaje de la Mona, perfecta para disfrutar del mar."
        },
        "Arecibo": {
            "description": "Arecibo es conocido por su gran radiotelescopio, siendo un municipio con una rica historia y atractivos naturales impresionantes."
        },
        "Arroyo": {
            "description": "Arroyo es un pequeño pueblo costero con una fuerte tradición marítima y un pintoresco malecón."
        },
        "Barceloneta": {
            "description": "Conocida como la 'Ciudad Industrial,' Barceloneta es famosa por su industria y sus hermosas playas."
        },
        "Barranquitas": {
            "description": "Barranquitas es un lugar conocido por sus vistas impresionantes y ricas tradiciones culturales."
        },
        "Bayamón": {
            "description": "Bayamón es reconocido por su vibrante comunidad, cultura deportiva, y sitios históricos."
        },
        "Cabo Rojo": {
            "description": "Cabo Rojo es famoso por sus impresionantes playas y el Faro de Cabo Rojo, siendo un destino turístico popular."
        },
        "Caguas": {
            "description": "Caguas es conocida por su riqueza cultural y como un centro de comercio e industria."
        },
        "Camuy": {
            "description": "Camuy es mejor conocido por el Parque de las Cavernas del Río Camuy, un espectacular sistema de cuevas subterráneas."
        },
        "Canóvanas": {
            "description": "Canóvanas es conocido por su cercanía al Bosque Nacional El Yunque y su comunidad vibrante."
        },
        "Carolina": {
            "description": "Carolina alberga el Aeropuerto Internacional Luis Muñoz Marín y es conocida por sus modernas comodidades y playas."
        },
        "Cataño": {
            "description": "Cataño es famoso por su malecón y la Destilería de Ron Bacardí, un atractivo turístico popular."
        },
        "Cayey": {
            "description": "Cayey es reconocida por su clima fresco, paisajes montañosos, y la hermosa Reserva Forestal Carite."
        },
        "Ceiba": {
            "description": "Ceiba es conocida por su rica historia militar y su enfoque en la conservación ambiental."
        },
        "Ciales": {
            "description": "Ciales es famoso por sus plantaciones de café y sus exuberantes paisajes naturales."
        },
        "Cidra": {
            "description": "Cidra, a menudo llamada la 'Ciudad de la Eterna Primavera,' es reconocida por su clima fresco y belleza natural."
        },
        "Coamo": {
            "description": "Coamo es uno de los pueblos más antiguos de Puerto Rico, famoso por sus aguas termales y sitios históricos."
        },
        "Comerío": {
            "description": "Comerío es conocido por sus hermosas montañas y su rico patrimonio cultural."
        },
        "Corozal": {
            "description": "Corozal es famoso por su agricultura, especialmente los plátanos, y su patrimonio cultural."
        },
        "Culebra": {
            "description": "Culebra es un municipio-isla conocido por sus playas prístinas y lugares ideales para el esnórquel."
        },
        "Dorado": {
            "description": "Dorado es reconocido por sus lujosos resorts, campos de golf, y hermosas playas."
        },
        "Fajardo": {
            "description": "Fajardo es famoso por sus marinas, la laguna bioluminiscente, y sus playas pintorescas."
        },
        "Florida": {
            "description": "Florida es conocido por sus cuevas y su rica tradición agrícola."
        },
        "Guánica": {
            "description": "Guánica es reconocida por su bosque seco, una reserva de biosfera designada por la UNESCO, y su histórica bahía."
        },
        "Guayama": {
            "description": "Guayama es conocida por su rica cultura, sitios históricos, y atractivos paisajes."
        },
        "Guayanilla": {
            "description": "Guayanilla es famosa por su bahía pintoresca y la popular Isla de Gilligan."
        },
        "Guaynabo": {
            "description": "Guaynabo es conocido por sus modernas comodidades, sitios históricos, y eventos culturales."
        },
        "Gurabo": {
            "description": "Gurabo es famoso por su crecimiento comunitario y sus ricas tradiciones agrícolas."
        },
        "Hatillo": {
            "description": "Hatillo es conocido por su industria lechera y el tradicional Festival de las Máscaras."
        },
        "Hormigueros": {
            "description": "Hormigueros es conocido por su importancia religiosa y la Basílica Menor de la Virgen de Monserrate."
        },
        "Humacao": {
            "description": "Humacao es famoso por sus reservas naturales, hermosas playas, y comunidades en crecimiento."
        },
        "Isabela": {
            "description": "Isabela es reconocida por sus playas impresionantes, ideales para el surf, y el Bosque de Guajataca."
        },
        "Jayuya": {
            "description": "Jayuya es conocido por su herencia indígena y sus impresionantes vistas montañosas."
        },
        "Juana Díaz": {
            "description": "Juana Díaz, conocida como la 'Ciudad de los Reyes,' es famosa por su festival de la Epifanía."
        },
        "Juncos": {
            "description": "Juncos es reconocido por su industria, especialmente el sector farmacéutico, y su ambiente comunitario."
        },
        "Lajas": {
            "description": "Lajas es conocido por La Parguera, una bahía bioluminiscente y un destino turístico popular."
        },
        "Lares": {
            "description": "Lares es históricamente significativo como el lugar de nacimiento del Grito de Lares, un hito importante en la historia de Puerto Rico."
        },
        "Las Marías": {
            "description": "Las Marías es reconocido por su producción de café y su belleza natural en la región montañosa."
        },
        "Las Piedras": {
            "description": "Las Piedras es famoso por sus productos agrícolas y su creciente sector comercial."
        },
        "Loíza": {
            "description": "Loíza es conocida por su rica cultura afro-puertorriqueña, música tradicional, y coloridos festivales."
        },
        "Luquillo": {
            "description": "Luquillo, conocido como la 'Capital del Sol,' es famoso por sus hermosas playas y ambiente turístico."
        },
        "Manatí": {
            "description": "Manatí es reconocido por sus playas espectaculares y su rica historia, incluyendo sitios arqueológicos."
        },
        "Maricao": {
            "description": "Maricao es famoso por su producción de café y el Festival del Acabe del Café."
        },
        "Maunabo": {
            "description": "Maunabo es conocido por sus playas pintorescas y el emblemático Faro de Punta Tuna."
        },
        "Mayagüez": {
            "description": "Mayagüez, la 'Sultana del Oeste,' es conocida por su universidad, su zoológico, y su vibrante vida cultural."
        },
        "Moca": {
            "description": "Moca es famoso por su producción de mundillo, un tipo de encaje tradicional puertorriqueño, y su rica herencia."
        },
        "Morovis": {
            "description": "Morovis es conocido por su tranquila belleza natural y su rica historia cultural."
        },
        "Naguabo": {
            "description": "Naguabo es famoso por su malecón y su gastronomía, especialmente los mariscos."
        },
        "Naranjito": {
            "description": "Naranjito es conocido por sus paisajes pintorescos y su ambiente tranquilo, ideal para disfrutar de la naturaleza."
        },
        "Orocovis": {
            "description": "Orocovis es llamado el 'Corazón de Puerto Rico' por su importancia cultural y su hermosa naturaleza montañosa."
        },
        "Patillas": {
            "description": "Patillas es conocida como la 'Esmeralda del Sur,' famosa por sus playas y sus tradiciones culturales."
        },
        "Peñuelas": {
            "description": "Peñuelas es conocida por su producción agrícola y su patrimonio cultural."
        },
        "Ponce": {
            "description": "Ponce, la 'Perla del Sur,' es famosa por su arquitectura, plazas históricas, y vibrante vida cultural."
        },
        "Quebradillas": {
            "description": "Quebradillas es conocido por sus acantilados costeros y su cultura vibrante."
        },
        "Rincón": {
            "description": "Rincón es un destino turístico popular, famoso por sus playas y su ambiente relajado."
        },
        "Río Grande": {
            "description": "Río Grande es conocido por su proximidad al Bosque Nacional El Yunque y su desarrollo turístico."
        },
        "Sabana Grande": {
            "description": "Sabana Grande es famoso por sus celebraciones religiosas y su rica tradición agrícola."
        },
        "Salinas": {
            "description": "Salinas es reconocida por su gastronomía, deportes acuáticos, y hermosas playas."
        },
        "San Germán": {
            "description": "San Germán, uno de los pueblos más antiguos de Puerto Rico, es famoso por su arquitectura histórica y su rica cultura."
        },
        "San Juan": {
            "description": "San Juan es la capital de Puerto Rico, conocida por su rica historia, vibrante vida cultural, y hermosas playas."
        },
        "San Lorenzo": {
            "description": "San Lorenzo es conocido por su belleza natural y sus festivales culturales."
        },
        "San Sebastián": {
            "description": "San Sebastián es famoso por sus montañas y su rica herencia cultural, incluidas sus tradiciones agrícolas."
        },
        "Santa Isabel": {
            "description": "Santa Isabel es conocida como la 'Ciudad de los Potros,' famosa por su agricultura y sus campos de caña de azúcar."
        },
        "Toa Alta": {
            "description": "Toa Alta es famoso por sus monumentos históricos y su ambiente tranquilo, ideal para la vida familiar."
        },
        "Toa Baja": {
            "description": "Toa Baja es conocida por su riqueza histórica y su vibrante vida comunitaria."
        },
        "Trujillo Alto": {
            "description": "Trujillo Alto es famoso por su ambiente residencial y sus modernos desarrollos comunitarios."
        },
        "Utuado": {
            "description": "Utuado es conocido por sus montañas, cuevas, y su importancia histórica en la cultura taína."
        },
        "Vega Alta": {
            "description": "Vega Alta es famosa por sus hermosas playas y su rica historia cultural."
        },
        "Vega Baja": {
            "description": "Vega Baja es conocida por sus impresionantes playas y su fuerte sentido de comunidad."
        },
        "Vieques": {
            "description": "Vieques es un municipio-isla famoso por sus playas prístinas y su bahía bioluminiscente."
        },
        "Villalba": {
            "description": "Villalba es conocida por sus frescas montañas y su agricultura, especialmente la producción de café."
        },
        "Yabucoa": {
            "description": "Yabucoa es famosa por sus campos de caña de azúcar y su rica herencia cultural."
        },
        "Yauco": {
            "description": "Yauco es conocido como la 'Capital del Café' y es famoso por su historia y su vibrante cultura cafetera."
        }
    };
    
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
        MunicipioDescription(); // Display the description of the new municipio
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

    // Function to display the description of the current municipio
    function MunicipioDescription() {
        const municipioName = currentMunicipio.properties.NAME;
        const description = municipiosData[municipioName]?.description || "Descripción no disponible.";
        document.getElementById('municipio-description').innerText = description;
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

