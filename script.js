let currentScore = 0;
let mistakes = 0;
let currentStep = 0;
let currentScenario = null;

const categories = [
    { type: 'emergency_objective', icon: '🛑', name: 'Primary Objective' },
    { type: 'evacuation_considerations', icon: '🚨', name: 'Evacuation Considerations' },
    { type: 'training_requirements', icon: '📚', name: 'Training Requirements' },
    { type: 'first_aid_location', icon: '💉', name: 'First Aid Equipment' },
    { type: 'initial_actions', icon: '🧳', name: 'Initial Emergency Actions' },
    { type: 'secondary_actions', icon: '📞', name: 'Secondary Actions' },
    { type: 'after_assessment', icon: '🔄', name: 'After Assessment' },
    { type: 'medical_assistance', icon: '🏥', name: 'Medical Assistance' },
    { type: 'emergency_windows', icon: '🪟', name: 'Emergency Windows' },
    { type: 'passenger_egress', icon: '🚪', name: 'Exiting the Train' },
    { type: 'crew_competency', icon: '🏅', name: 'Crew Competency' },
    { type: 'primary_concern', icon: '⚠️', name: 'Primary Concern' }
];

// Ensure the DOM is fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories');

    if (!categoriesContainer) {
        console.error("ERROR: Could not find categories container in the DOM.");
        return;
    }

    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'train-car';
        div.setAttribute('data-type', category.type);
        div.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <div>${category.name}</div>
        `;
        div.addEventListener('click', () => showScenario(category.type));
        categoriesContainer.appendChild(div);
    });
});

const scenarios = {
     emergency_objective: [
    {
      title: "Primary Objective in Emergency Response",
      text: "In any emergency response, the primary objective for all response operations will always be safety.",
      steps: [
        {
          question: "In any emergency response, the primary objective for all response operations will always be?",
          options: [
            { text: "Meeting scheduling requirements", correct: false },
            { text: "Safety of all persons", correct: true },
            { text: "Confirming passenger consist", correct: false },
            { text: "Keeping out of the way", correct: false }
          ]
        }
      ]
    }
  ],
  evacuation_considerations: [
    {
      title: "Evacuation Considerations",
      text: "When considering an evacuation of the passenger train, safety of location, passengers, and assistance for the impaired should be considered.",
      steps: [
        {
          question: "When considering an evacuation of the passenger train, what considerations should be made?",
          options: [
            { text: "Safety of evacuation location", correct: false },
            { text: "Are there disabled or mobility impaired passengers onboard", correct: false },
            { text: "Are there injured passengers onboard the train that need additional assistance", correct: false },
            { text: "All of the above are correct", correct: true }
          ]
        }
      ]
    }
  ],
  training_requirements: [
    {
      title: "Training Requirements",
      text: "Who needs to be trained on the Passenger Train Emergency Preparedness Plan at the ARRC?",
      steps: [
        {
          question: "Who needs to be trained on the Passenger Train Emergency Preparedness Plan at the ARRC?",
          options: [
            { text: "Pull contractor employees (HAP, RCT)", correct: false },
            { text: "Caterers on-board trains", correct: false },
            { text: "ARRC MOW and Signalmen", correct: false },
            { text: "All of the above", correct: true }
          ]
        }
      ]
    }
  ],
  first_aid_location: [
    {
      title: "First Aid Equipment Location",
      text: "Emergency first aid equipment on passenger trains is located in specific areas such as the Conductor dome.",
      steps: [
        {
          question: "Emergency first aid equipment on passenger trains is located in the:",
          options: [
            { text: "Baggage Car", correct: false },
            { text: "Locomotive", correct: false },
            { text: "Conductor dome unless otherwise stated in the Safety Briefing", correct: true },
            { text: "Dining Car", correct: false }
          ]
        }
      ]
    }
  ],
  initial_actions: [
    {
      title: "Initial Emergency Actions",
      text: "In any emergency, the first action should be to stay calm and assess the situation.",
      steps: [
        {
          question: "In an emergency, the first thing you should do is?",
          options: [
            { text: "Call the Dispatcher", correct: false },
            { text: "Get away from the situation", correct: false },
            { text: "Gather the on-board crew", correct: false },
            { text: "Stay calm", correct: true }
          ]
        }
      ]
    }
  ],
  secondary_actions: [
    {
      title: "Secondary Emergency Actions",
      text: "The second step in an emergency is to assess safety of all involved parties.",
      steps: [
        {
          question: "In an emergency, the second thing you should do is?",
          options: [
            { text: "Assess your personal safety", correct: true },
            { text: "Passenger safety", correct: false },
            { text: "Crew safety and location", correct: false },
            { text: "Make sure the fire extinguisher is fully charged", correct: false }
          ]
        }
      ]
    }
  ],
  after_assessment: [
    {
      title: "After Safety Assessment",
      text: "After determining that you and the crew are safe, the next step is to call the ARRC dispatcher.",
      steps: [
        {
          question: "After you have made an assessment to determine if you and the rest of the on-board crew are safe and will remain safe, you should?",
          options: [
            { text: "Find a map", correct: false },
            { text: "Locate medical equipment", correct: false },
            { text: "Determine if terrorism is involved", correct: false },
            { text: "Call the ARRC dispatcher", correct: true }
          ]
        }
      ]
    }
  ],
  medical_assistance: [
    {
      title: "Emergency Medical Assistance",
      text: "If immediate medical assistance is required, crew members should seek help from medically trained passengers or request assistance from the dispatcher.",
      steps: [
        {
          question: "In an emergency situation where immediate medical assistance is required, crew members should?",
          options: [
            { text: "Ask for any medically trained passengers who would be willing to assist", correct: true },
            { text: "Request assistance from the Dispatcher", correct: false },
            { text: "Call Life Flight", correct: false },
            { text: "Call the nearest medical facility", correct: false }
          ]
        }
      ]
    }
  ],
  emergency_windows: [
    {
      title: "Emergency Window Identification",
      text: "Emergency windows are marked with a red handle to indicate easy removal in case of an emergency.",
      steps: [
        {
          question: "Emergency windows on passenger cars are identified by a red handle on the gasket sealing the window?",
          options: [
            { text: "True", correct: true },
            { text: "False", correct: false }
          ]
        }
      ]
    }
  ],
  passenger_egress: [
    {
      title: "Passenger Car Egress",
      text: "To exit a passenger car, there are several ways including through the vestibules or emergency windows.",
      steps: [
        {
          question: "To exit a passenger car you can?",
          options: [
            { text: "Exit through the ends of each car into the next car in the train", correct: false },
            { text: "Exit through the vestibules to the outdoors", correct: false },
            { text: "Any of the emergency windows can be removed for egress", correct: false },
            { text: "All of the above", correct: true }
          ]
        }
      ]
    }
  ],
  crew_competency: [
    {
      title: "Crew Member Training Requirements",
      text: "Each crew member must demonstrate competency in specific areas including hazard awareness, situational awareness, and emergency equipment usage.",
      steps: [
        {
          question: "Each crew member on a passenger train must have sufficient training or proven experience to demonstrate competency in specific areas?",
          options: [
            { text: "An understanding of the potential hazards that are presented by passenger train equipment and situational awareness.", correct: true },
            { text: "Have taken and passed the PTEPP test", correct: false },
            { text: "Understand and know how to use the emergency equipment on the train", correct: false },
            { text: "All of the above", correct: true }
          ]
        }
      ]
    }
  ],
  primary_concern: [
    {
      title: "Primary Concern",
      text: "The primary concern for ARRC employees or contractors should always be safety.",
      steps: [
        {
          question: "The primary concern for every ARRC employee or contractor should be?",
          options: [
            { text: "Safety", correct: true },
            { text: "Revenue", correct: false },
            { text: "Keeping schedules", correct: false },
            { text: "Departure times", correct: false }
          ]
        }
      ]
    }
  ]
 
};

function showScenario(type) {
    if (!scenarios[type] || scenarios[type].length === 0) {
        console.error(`No scenarios found for category: ${type}`);
        return;
    }

    // Play the audio for this category
    playAudioForCategory(type);

    currentStep = 0;
    currentScenario = scenarios[type][0];
    updateScenarioDisplay();
    document.getElementById('scenarioCard').classList.remove('hidden');
    document.getElementById('categories').style.display = 'none';
}

function updateScenarioDisplay() {
    if (!currentScenario || !currentScenario.steps[currentStep]) {
        console.error("ERROR: Scenario is undefined or missing steps.");
        return;
    }

    const step = currentScenario.steps[currentStep];
    document.getElementById('categoryTitle').textContent = currentScenario.title;
    document.getElementById('scenarioText').textContent = step.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    step.options.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option.text;
        button.addEventListener('click', () => selectOption(option, button));
        optionsDiv.appendChild(button);
    });

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('nextButton').classList.add('hidden');
}

function selectOption(option, button) {
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
    });

    const feedback = document.getElementById('feedback');
    feedback.textContent = option.correct ? 'Correct! +1 Point' : 'Incorrect! What should you have done?';
    feedback.className = `feedback ${option.correct ? 'correct' : 'incorrect'}`;
    feedback.classList.remove('hidden');

    if (option.correct) {
        playCorrectSound();
        currentScore++;
        document.getElementById('scoreDisplay').textContent = currentScore;
        button.classList.add('correct');
    } else {
        playIncorrectSound();
        mistakes++;
        document.getElementById('mistakesDisplay').textContent = mistakes;
        button.classList.add('selected');
    }

    const nextButton = document.getElementById('nextButton');
    nextButton.classList.remove('hidden');
    nextButton.onclick = () => {
        if (currentStep < currentScenario.steps.length - 1) {
            currentStep++;
            updateScenarioDisplay();
        } else {
            document.getElementById('scenarioCard').classList.add('hidden');
            document.getElementById('categories').style.display = 'grid';
        }
    };
}

function playAudioForCategory(categoryType) {
    // Get the corresponding audio element
    const audioElement = document.getElementById(`${categoryType}-audio`);
    
    if (audioElement) {
        audioElement.play()
            .catch(error => console.log(`Error playing ${categoryType} audio:`, error));
    } else {
        console.log(`Audio element for ${categoryType} not found`);
    }
}

function playCorrectSound() {
    const correctSound = document.getElementById('correct-sound');
    if (correctSound) {
        correctSound.play()
            .catch(error => console.log('Error playing correct sound:', error));
    }
}

function playIncorrectSound() {
    const incorrectSound = document.getElementById('incorrect-sound');
    if (incorrectSound) {
        incorrectSound.play()
            .catch(error => console.log('Error playing incorrect sound:', error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const fullscreenImage = document.getElementById('fullscreen-image');
    const mainContent = document.getElementById('main-content');

    fullscreenImage.addEventListener('click', function() {
        fullscreenImage.style.display = 'none';
        mainContent.classList.remove('hidden');
    });
});