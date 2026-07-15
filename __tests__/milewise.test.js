// @ts-nocheck
/* eslint-disable */
// ─── MileWise Unit Tests — Week 12 ───────────────────────────────────────────
// ─── MileWise Unit Tests — Week 12 ───────────────────────────────────────────
// Jest unit tests for MileWise core business logic

// ── Helper Functions to Test ──────────────────────────────────────────────────

function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString("en-KE")}`;
}

function calculateFuelCost(liters, costPerLiter) {
  return liters * costPerLiter;
}

function getReminderStatus(remainingKm) {
  if (remainingKm <= 500) return "URGENT";
  if (remainingKm <= 3000) return "SOON";
  return "OK";
}

function getNextServiceMileage(lastServiceMileage, intervalKm) {
  return lastServiceMileage + intervalKm;
}

function getRemainingKm(currentMileage, nextServiceMileage) {
  return Math.max(0, nextServiceMileage - currentMileage);
}

function isValidRegistration(regNo) {
  const pattern = /^[A-Z]{3}\s\d{3}[A-Z]$/;
  return pattern.test(regNo.trim().toUpperCase());
}

function isValidMileage(mileage) {
  return mileage > 0 && mileage < 1000000;
}

function calculateAvgConsumption(totalLiters, totalKm) {
  if (totalKm === 0) return 0;
  return parseFloat(((totalLiters / totalKm) * 100).toFixed(2));
}

// ── Test Suite 1: Currency Formatting ────────────────────────────────────────
describe("Currency Formatting Tests", () => {
  test("formats whole number correctly", () => {
    expect(formatKES(5000)).toBe("KES 5,000");
  });

  test("formats large amount correctly", () => {
    expect(formatKES(125000)).toBe("KES 125,000");
  });

  test("formats zero correctly", () => {
    expect(formatKES(0)).toBe("KES 0");
  });
});

// ── Test Suite 2: Fuel Cost Calculation ──────────────────────────────────────
describe("Fuel Cost Calculation Tests", () => {
  test("calculates total fuel cost correctly", () => {
    expect(calculateFuelCost(40, 180)).toBe(7200);
  });

  test("calculates zero liters correctly", () => {
    expect(calculateFuelCost(0, 180)).toBe(0);
  });

  test("calculates fractional liters correctly", () => {
    expect(calculateFuelCost(20.5, 200)).toBe(4100);
  });
});

// ── Test Suite 3: Reminder Status ────────────────────────────────────────────
describe("Reminder Status Tests", () => {
  test("returns URGENT when remaining km is 500 or less", () => {
    expect(getReminderStatus(500)).toBe("URGENT");
    expect(getReminderStatus(0)).toBe("URGENT");
    expect(getReminderStatus(100)).toBe("URGENT");
  });

  test("returns SOON when remaining km is between 501 and 3000", () => {
    expect(getReminderStatus(1000)).toBe("SOON");
    expect(getReminderStatus(3000)).toBe("SOON");
  });

  test("returns OK when remaining km is above 3000", () => {
    expect(getReminderStatus(5000)).toBe("OK");
    expect(getReminderStatus(15000)).toBe("OK");
  });
});

// ── Test Suite 4: Service Mileage Calculation ─────────────────────────────────
describe("Service Mileage Calculation Tests", () => {
  test("calculates next oil change mileage correctly", () => {
    expect(getNextServiceMileage(80000, 5000)).toBe(85000);
  });

  test("calculates next tire replacement mileage correctly", () => {
    expect(getNextServiceMileage(40000, 50000)).toBe(90000);
  });

  test("calculates remaining km correctly", () => {
    expect(getRemainingKm(84500, 85000)).toBe(500);
  });

  test("returns 0 when service is overdue", () => {
    expect(getRemainingKm(86000, 85000)).toBe(0);
  });
});

// ── Test Suite 5: Input Validation ───────────────────────────────────────────
describe("Input Validation Tests", () => {
  test("validates correct Kenya registration number", () => {
    expect(isValidRegistration("KDG 123A")).toBe(true);
    expect(isValidRegistration("KCD 456B")).toBe(true);
  });

  test("rejects invalid registration number", () => {
    expect(isValidRegistration("INVALID")).toBe(false);
    expect(isValidRegistration("12345")).toBe(false);
    expect(isValidRegistration("")).toBe(false);
  });

  test("validates correct mileage", () => {
    expect(isValidMileage(84500)).toBe(true);
    expect(isValidMileage(1)).toBe(true);
  });

  test("rejects invalid mileage", () => {
    expect(isValidMileage(0)).toBe(false);
    expect(isValidMileage(-100)).toBe(false);
    expect(isValidMileage(1000001)).toBe(false);
  });
});

// ── Test Suite 6: Fuel Consumption ───────────────────────────────────────────
describe("Fuel Consumption Tests", () => {
  test("calculates average consumption correctly", () => {
    expect(calculateAvgConsumption(40, 400)).toBe(10);
  });

  test("returns 0 when distance is 0", () => {
    expect(calculateAvgConsumption(40, 0)).toBe(0);
  });

  test("calculates fractional consumption correctly", () => {
    expect(calculateAvgConsumption(35, 500)).toBe(7);
  });
});
