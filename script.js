// Hämta element
const voltageInput = document.getElementById('voltage');
const addResistorButton = document.getElementById('addResistorButton');
const resistorInputs = document.getElementById('resistorInputs');
const calculateButton = document.getElementById('calculateButton');
const totalResistanceOutput = document.getElementById('totalResistance');
const currentOutput = document.getElementById('current');
const inductorInput = document.getElementById('inductor');
const frequencyInput = document.getElementById('frequency');
const inductorInfo = document.getElementById('inductorInfo');
const phaseShiftOutput = document.getElementById('phaseShift');

// Lägg till en ny resistor
addResistorButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'resistor';
  input.placeholder = 'Ange resistans';
  resistorInputs.appendChild(input);
});

// Beräkna total resistans, ström och fasförskjutning
calculateButton.addEventListener('click', () => {
  const voltage = parseFloat(voltageInput.value);
  const resistors = Array.from(document.querySelectorAll('.resistor')).map(input => parseFloat(input.value));
  const connectionType = document.querySelector('input[name="connectionType"]:checked').value;
  const inductor = parseFloat(inductorInput.value);
  const frequency = parseFloat(frequencyInput.value);

  // Kontrollera om inmatningarna är giltiga
  if (isNaN(voltage) || resistors.some(r => isNaN(r) || r <= 0) || (isNaN(inductor) && inductorInput.value !== "") || isNaN(frequency) || frequency <= 0) {
    totalResistanceOutput.textContent = 'Total resistans: Ogiltiga värden!';
    currentOutput.textContent = 'Ström: Ogiltiga värden!';
    phaseShiftOutput.textContent = 'Fasförskjutning: Ogiltiga värden!';
    return;
  }

  let totalResistance;
  let totalCurrent;
  let phaseShift = 0;  // Standardfasförskjutning (ingen spole)

  // Lägg till spolen i seriekopplingen om den är vald
  if (inductorInput.value !== "") {
    // Om induktans anges, behandla den som ett motstånd i DC-krets
    totalResistance = resistors.reduce((sum, r) => sum + r, 0) + inductor; // Lägg till induktansen som resistans
    inductorInfo.textContent = `Induktans: ${inductor} H (beaktas i denna DC-krets som ett motstånd).`;

    // Beräkna fasförskjutning
    const inductiveReactance = 2 * Math.PI * frequency * inductor; // Induktiv reaktans
    phaseShift = Math.atan(inductiveReactance / totalResistance);  // Fasförskjutning
  } else {
    totalResistance = resistors.reduce((sum, r) => sum + r, 0);
    inductorInfo.textContent = `Induktans påverkar inte DC-kretsar.`;
  }

  if (connectionType === 'series') {
    totalCurrent = voltage / totalResistance;
  } else if (connectionType === 'parallel') {
    totalResistance = 1 / resistors.reduce((sum, r) => sum + 1 / r, 0);
    totalCurrent = voltage / totalResistance;
  }

  // Visa total resistans, ström och fasförskjutning
  totalResistanceOutput.textContent = `Total resistans: ${totalResistance.toFixed(2)} Ω`;
  currentOutput.textContent = `Total ström: ${totalCurrent.toFixed(2)} A`;
  phaseShiftOutput.textContent = `Fasförskjutning: ${(phaseShift * 180 / Math.PI).toFixed(2)}°`;
});
