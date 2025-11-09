// Weather API Key - Replace with your own from OpenWeatherMap
const API_KEY = '060dca014422394453c5ddcb500b95ed';

// Note: OpenAI API cannot be used directly from browser due to CORS restrictions
// For production use, you'd need a backend proxy server

// DOM Elements
const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const weatherDisplay = document.getElementById('weather-display');
const questionInput = document.getElementById('question-input');
const askBtn = document.getElementById('ask-btn');
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
const responseDisplay = document.getElementById('response-display');

// Event Listeners
getWeatherBtn.addEventListener('click', getWeather);
askBtn.addEventListener('click', handleTextQuestion);
voiceBtn.addEventListener('click', handleVoiceQuestion);

// Weather Function
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            const weatherInfo = `
                <h3>Weather in ${data.name}, ${data.sys.country}</h3>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
            weatherDisplay.innerHTML = weatherInfo;
        } else {
            weatherDisplay.innerHTML = '<p>City not found. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherDisplay.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    }
}

// Text Question Handler
function handleTextQuestion() {
    const question = questionInput.value.trim();
    if (!question) {
        alert('Please enter a question');
        return;
    }

    // Show loading message
    displayResponse('Thinking...');

    // Simulate async behavior for consistency
    setTimeout(() => {
        const answer = getAnswer(question);
        displayResponse(answer);
        questionInput.value = '';
    }, 500); // Small delay to show "Thinking..." message
}

// Voice Question Handler
function handleVoiceQuestion() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Can be changed to 'hi-IN' for Hindi if needed
    recognition.interimResults = false;

    recognition.onstart = () => {
        voiceStatus.textContent = 'Listening... Speak your question.';
        voiceBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceStatus.textContent = `You said: "${transcript}"`;

        // Show loading message
        displayResponse('Thinking...');

        // Simulate async behavior for consistency
        setTimeout(() => {
            const answer = getAnswer(transcript);
            displayResponse(answer);
            speakResponse(answer);
        }, 500); // Small delay to show "Thinking..." message
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = 'Error occurred. Please try again.';
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        voiceBtn.disabled = false;
        setTimeout(() => {
            voiceStatus.textContent = 'Click to start voice input';
        }, 2000);
    };

    recognition.start();
}

// Get Answer Function (Enhanced Q&A for agricultural doubts)
function getAnswer(question) {
    // Enhanced responses with more comprehensive answers
    const responses = {
        'what is irrigation': 'Irrigation is the artificial application of water to land or soil to assist in the growing of crops. It helps farmers control water supply, ensuring crops get the right amount of water at the right time, which is crucial for maximizing yields and preventing crop failure.',
        'how to prevent pests': 'Use integrated pest management (IPM): crop rotation, natural predators, organic pesticides, companion planting, and regular field monitoring. Avoid overuse of chemical pesticides to prevent resistance and environmental damage.',
        'best time to plant rice': 'Rice is typically planted during the monsoon season, around June-July in many regions. The ideal time depends on your location\'s climate - generally when soil temperature is above 15°C and rainfall is consistent.',
        'what is organic farming': 'Organic farming avoids synthetic pesticides and fertilizers, using natural methods to maintain soil fertility. It relies on crop rotation, compost, biological pest control, and natural fertilizers to produce healthy food while protecting the environment.',
        'how to improve soil fertility': 'Add compost, use crop rotation, plant cover crops, avoid overuse of chemical fertilizers, test soil pH regularly, and incorporate organic matter. Soil fertility is key to sustainable agriculture.',
        'what is drought': 'Drought is a prolonged period of abnormally low rainfall, leading to a shortage of water. It can severely impact agriculture by reducing crop yields, increasing irrigation costs, and causing long-term soil damage.',
        'how to conserve water': 'Use drip irrigation, rainwater harvesting, plant drought-resistant crops, implement mulching, schedule irrigation during cooler hours, and monitor soil moisture levels. Water conservation is essential for sustainable farming.',
        'what are fertilizers': 'Fertilizers are substances added to soil to provide essential nutrients for plant growth. They can be organic (compost, manure) or inorganic (chemical). Proper fertilization ensures healthy plant development and good yields.',
        'how to identify plant diseases': 'Look for symptoms like discoloration, spots, wilting, stunted growth, or unusual patterns on leaves and stems. Early identification is crucial - consult local agricultural experts for accurate diagnosis and treatment.',
        'what is crop rotation': 'Crop rotation is the practice of growing different crops in the same area in sequenced seasons. It helps maintain soil fertility, reduce pest and disease pressure, and improve overall farm productivity.',
        'how to control weeds': 'Use mulching, hand weeding, mechanical cultivation, cover crops, and selective herbicides. Integrated weed management prevents weed competition and maintains soil health.',
        'best crops for small farms': 'Consider high-value crops like vegetables, herbs, fruits, or specialty crops. Choose based on your local climate, market demand, and available resources.',
        'what is sustainable agriculture': 'Sustainable agriculture meets current food needs without compromising future generations. It includes practices like organic farming, conservation tillage, integrated pest management, and efficient resource use.',
        'how to test soil quality': 'Get a professional soil test to check pH, nutrient levels, organic matter content, and texture. Regular testing helps you make informed decisions about fertilization and soil management.',
        'what are cover crops': 'Cover crops are plants grown primarily to improve soil health, prevent erosion, and suppress weeds. Examples include clover, rye, and legumes, which add organic matter and fix nitrogen in the soil.',
        'how to prevent soil erosion': 'Use contour farming, terracing, windbreaks, cover crops, no-till farming, and maintain vegetation cover. Soil erosion prevention is crucial for long-term land productivity.',
        'best practices for vegetable gardening': 'Start with good soil preparation, use compost, water consistently, provide adequate spacing, rotate crops annually, and monitor for pests regularly.',
        'what is hydroponics': 'Hydroponics is a method of growing plants without soil, using nutrient-rich water solutions. It allows precise control over plant nutrition and can produce higher yields in controlled environments.',
        'how to store grains': 'Store grains in clean, dry, cool conditions away from pests. Use airtight containers, maintain proper moisture levels, and regularly inspect for insect damage or mold.',
        'what are biofertilizers': 'Biofertilizers are living microorganisms that enhance soil fertility by fixing atmospheric nitrogen, solubilizing phosphorus, or producing plant growth hormones. They\'re an eco-friendly alternative to chemical fertilizers.'
    };

    // Simple keyword matching with case-insensitive search
    const lowerQuestion = question.toLowerCase();
    for (const key in responses) {
        if (lowerQuestion.includes(key)) {
            return responses[key];
        }
    }

    // If no specific match, provide a general helpful response
    return 'I\'m sorry, I don\'t have specific information on that topic yet. For detailed agricultural advice, please consult your local agricultural extension office or a qualified agricultural expert who can provide guidance tailored to your specific location and conditions.';
}

// Display Response
function displayResponse(response) {
    responseDisplay.innerHTML = `<p>${response}</p>`;
}

// Speak Response
function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Can be changed to 'hi-IN' for Hindi
        window.speechSynthesis.speak(utterance);
    }
}
 