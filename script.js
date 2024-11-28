// Hämta element
const voltageInput = document.getElementById("voltage");
const currentInput = document.getElementById("current");
const resistanceInput = document.getElementById("resistance");
const addResistorButton = document.getElementById("addResistorButton");
const resistorInputs = document.getElementById("resistorInputs");
const calculateButton = document.getElementById("calculateButton");
const totalResistanceOutput = document.getElementById("totalResistance");
const currentOutput = document.getElementById("currentOutput");
const voltageOutput = document.getElementById("voltageOutput");
const inductorInput = document.getElementById("inductor");
const capacitanceInput = document.getElementById("capacitance");
const frequencyInput = document.getElementById("frequency");
const inductorInfo = document.getElementById("inductorInfo");
const phaseShiftOutput = document.getElementById("phaseShift");
const activePowerOutput = document.getElementById("activePower");
const reactivePowerOutput = document.getElementById("reactivePower");
const totalPowerOutput = document.getElementById("totalPower");

// Lägg till en ny resistor
addResistorButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "number";
  input.className = "resistor";
  input.placeholder = "Ange resistans";
  resistorInputs.appendChild(input);
});

// Beräkna total resistans, ström, fasförskjutning och effekt
calculateButton.addEventListener("click", () => {
  const voltage = parseFloat(voltageInput.value);
  const current = parseFloat(currentInput.value);
  const resistance = parseFloat(resistanceInput.value);
  const resistors = Array.from(document.querySelectorAll(".resistor")).map(
    (input) => parseFloat(input.value)
  );
  const circuitType = document.querySelector(
    'input[name="circuitType"]:checked'
  ).value; // AC eller DC
  const connectionType = document.querySelector(
    'input[name="connectionType"]:checked'
  ).value;
  const inductor = parseFloat(inductorInput.value);
  const capacitance = parseFloat(capacitanceInput.value);
  const frequency = parseFloat(frequencyInput.value);

  // Beräkna saknade värden med Ohms lag
  let calculatedVoltage = voltage;
  let calculatedCurrent = current;
  let calculatedResistance = resistance;

  if (isNaN(calculatedVoltage) && !isNaN(calculatedCurrent) && !isNaN(calculatedResistance)) {
    calculatedVoltage = calculatedCurrent * calculatedResistance;
  } else if (isNaN(calculatedCurrent) && !isNaN(calculatedVoltage) && !isNaN(calculatedResistance)) {
    calculatedCurrent = calculatedVoltage / calculatedResistance;
  } else if (isNaN(calculatedResistance) && !isNaN(calculatedVoltage) && !isNaN(calculatedCurrent)) {
    calculatedResistance = calculatedVoltage / calculatedCurrent;
  }

  // Kontrollera om inmatningarna är giltiga
  if (isNaN(calculatedVoltage) && isNaN(calculatedCurrent) && isNaN(calculatedResistance)) {
    totalResistanceOutput.textContent =
      "Vänligen ange minst två av spänning, ström eller resistans.";
    return;
  }

  // Beräkna total resistans (seriekoppling eller parallellkoppling)
  let totalResistanceFinal;
  if (connectionType === "series") {
    totalResistanceFinal = resistors.reduce(
      (sum, r) => sum + r,
      calculatedResistance
    );
  } else if (connectionType === "parallel") {
    totalResistanceFinal =
      1 / resistors.reduce((sum, r) => sum + 1 / r, 1 / calculatedResistance);
  }

  // Resultat för AC eller DC
  if (circuitType === "dc") {
    const activePower = calculatedVoltage * calculatedCurrent;
    totalResistanceOutput.textContent = `Total resistans: ${totalResistanceFinal.toFixed(
      2
    )} Ω`;
    currentOutput.textContent = `Ström: ${calculatedCurrent.toFixed(2)} A`;
    voltageOutput.textContent = `Spänning: ${calculatedVoltage.toFixed(2)} V`;
    totalPowerOutput.textContent = `Total effekt: ${activePower.toFixed(2)} W`;
    reactivePowerOutput.textContent = `Reaktiv effekt: 0 W (för DC)`;
    phaseShiftOutput.textContent = "Fasförskjutning: 0°";
    inductorInfo.textContent = "Induktans påverkar inte DC-kretsar.";
  } else {
    // För AC: Beräkna impedans och fasförskjutning
    const X_L = inductor ? 2 * Math.PI * frequency * inductor : 0;
    const X_C = capacitance ? 1 / (2 * Math.PI * frequency * capacitance) : 0;
    const X_total = X_L - X_C;
    const totalImpedance = Math.sqrt(totalResistanceFinal ** 2 + X_total ** 2);
    const phaseShift = Math.atan(X_total / totalResistanceFinal);

    const activePower = calculatedVoltage * calculatedCurrent * Math.cos(phaseShift);
    const reactivePower = calculatedVoltage * calculatedCurrent * Math.sin(phaseShift);
    const totalPower = calculatedVoltage * calculatedCurrent;

    totalResistanceOutput.textContent = `Total resistans: ${totalResistanceFinal.toFixed(
      2
    )} Ω`;
    currentOutput.textContent = `Ström: ${calculatedCurrent.toFixed(2)} A`;
    voltageOutput.textContent = `Spänning: ${calculatedVoltage.toFixed(2)} V`;
    inductorInfo.textContent =
      X_L > 0
        ? `Induktiv reaktans: ${X_L.toFixed(2)} Ω`
        : "Ingen induktor angiven.";
    phaseShiftOutput.textContent = `Fasförskjutning: ${(
      (phaseShift * 180) /
      Math.PI
    ).toFixed(2)}°`;
    activePowerOutput.textContent = `Aktiv effekt: ${activePower.toFixed(2)} W`;
    reactivePowerOutput.textContent = `Reaktiv effekt: ${reactivePower.toFixed(
      2
    )} VAR`;
    totalPowerOutput.textContent = `Total effekt: ${totalPower.toFixed(2)} VA`;
  }
});
