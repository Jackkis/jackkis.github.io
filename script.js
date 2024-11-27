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

  // Kontrollera om inmatningarna är giltiga
  if (isNaN(voltage) && isNaN(current) && isNaN(resistance)) {
    totalResistanceOutput.textContent =
      "Vänligen ange minst en av spänning, ström eller resistans.";
    return;
  }

  // Beräkna resistans om den saknas
  let totalResistance;
  if (isNaN(resistance)) {
    if (!isNaN(voltage) && !isNaN(current)) {
      totalResistance = voltage / current;
    } else {
      totalResistanceOutput.textContent =
        "För att beräkna resistans måste spänning och ström anges.";
      return;
    }
  } else {
    totalResistance = resistance;
  }

  // Beräkna ström om den saknas
  let totalCurrent;
  if (isNaN(current)) {
    if (!isNaN(voltage) && !isNaN(totalResistance)) {
      totalCurrent = voltage / totalResistance;
    } else {
      currentOutput.textContent =
        "För att beräkna ström måste spänning och resistans anges.";
      return;
    }
  } else {
    totalCurrent = current;
  }

  // Beräkna spänning om den saknas
  let totalVoltage;
  if (isNaN(voltage)) {
    if (!isNaN(totalCurrent) && !isNaN(totalResistance)) {
      totalVoltage = totalCurrent * totalResistance;
    } else {
      voltageOutput.textContent =
        "För att beräkna spänning måste ström och resistans anges.";
      return;
    }
  } else {
    totalVoltage = voltage;
  }

  // Beräkna total resistans (seriekoppling eller parallellkoppling)
  let totalResistanceFinal;
  if (connectionType === "series") {
    totalResistanceFinal = resistors.reduce(
      (sum, r) => sum + r,
      totalResistance
    );
  } else if (connectionType === "parallel") {
    totalResistanceFinal =
      1 / resistors.reduce((sum, r) => sum + 1 / r, 1 / totalResistance);
  }

  // Resultat för AC eller DC
  if (circuitType === "dc") {
    // För DC: Beräkna effekt, ström, resistans och spänning
    const activePower = totalVoltage * totalCurrent;
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

    const activePower = totalVoltage * totalCurrent * Math.cos(phaseShift);
    const reactivePower = totalVoltage * totalCurrent * Math.sin(phaseShift);
    const totalPower = totalVoltage * totalCurrent;

    totalResistanceOutput.textContent = `Total resistans: ${totalResistanceFinal.toFixed(
      2
    )} Ω`;
    currentOutput.textContent = `Ström: ${totalCurrent.toFixed(2)} A`;
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
