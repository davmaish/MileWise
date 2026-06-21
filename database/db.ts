// Implements: Normalized schema, FuelLogs table, foreign keys, CASCADE DELETE
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("milewise_v2.db");

export function initDatabase() {
  // Enable foreign key enforcement (OFF by default in SQLite)
  db.execSync("PRAGMA foreign_keys = ON;");

  db.execSync(`
    -- Table 1: Vehicle Profile (normalized — one vehicle per app instance)
    CREATE TABLE IF NOT EXISTS vehicle_profile (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleName           TEXT NOT NULL,
      manufacturer          TEXT NOT NULL,
      model                 TEXT NOT NULL,
      year                  TEXT NOT NULL,
      registrationNumber    TEXT NOT NULL UNIQUE,
      currentMileage        INTEGER NOT NULL,
      created_at            TEXT NOT NULL DEFAULT (datetime('now')),
      sync_status           INTEGER DEFAULT 0
    );

    -- Table 2: Maintenance Records (FK → vehicle_profile)
    CREATE TABLE IF NOT EXISTS maintenance_records (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id          INTEGER NOT NULL,
      serviceType         TEXT NOT NULL,
      date                TEXT NOT NULL,
      mileageAtService    INTEGER NOT NULL,
      cost                REAL NOT NULL,
      notes               TEXT,
      sync_status         INTEGER DEFAULT 0,
      FOREIGN KEY (vehicle_id)
        REFERENCES vehicle_profile(id)
        ON DELETE CASCADE
    );

    -- Table 3: Fuel Logs (FK → vehicle_profile) — NEW Week 7
    CREATE TABLE IF NOT EXISTS fuel_logs (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id          INTEGER NOT NULL,
      liters              REAL NOT NULL,
      cost_per_liter      REAL NOT NULL,
      total_cost          REAL NOT NULL,
      mileage_at_fillup   INTEGER NOT NULL,
      date                TEXT NOT NULL,
      station_name        TEXT,
      sync_status         INTEGER DEFAULT 0,
      FOREIGN KEY (vehicle_id)
        REFERENCES vehicle_profile(id)
        ON DELETE CASCADE
    );
  `);
}

// ── Vehicle CRUD ──────────────────────────────────────────────────────────────

export function saveVehicle(vehicle: {
  vehicleName: string;
  manufacturer: string;
  model: string;
  year: string;
  registrationNumber: string;
  currentMileage: number;
}) {
  db.execSync("DELETE FROM vehicle_profile;");
  db.runSync(
    `INSERT INTO vehicle_profile
      (vehicleName, manufacturer, model, year, registrationNumber, currentMileage)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      vehicle.vehicleName,
      vehicle.manufacturer,
      vehicle.model,
      vehicle.year,
      vehicle.registrationNumber,
      vehicle.currentMileage,
    ],
  );
}

export function getVehicle() {
  return db.getFirstSync<{
    id: number;
    vehicleName: string;
    manufacturer: string;
    model: string;
    year: string;
    registrationNumber: string;
    currentMileage: number;
  }>("SELECT * FROM vehicle_profile LIMIT 1;");
}

// ── Maintenance Records CRUD ──────────────────────────────────────────────────

export function insertRecord(record: {
  serviceType: string;
  date: string;
  mileageAtService: number;
  cost: number;
  notes: string;
}) {
  // Get vehicle id for foreign key
  const vehicle = getVehicle();
  const vehicleId = vehicle?.id ?? 1;
  db.runSync(
    `INSERT INTO maintenance_records
      (vehicle_id, serviceType, date, mileageAtService, cost, notes)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      vehicleId,
      record.serviceType,
      record.date,
      record.mileageAtService,
      record.cost,
      record.notes,
    ],
  );
}

export function getAllRecords() {
  return db.getAllSync<{
    id: number;
    serviceType: string;
    date: string;
    mileageAtService: number;
    cost: number;
    notes: string;
  }>("SELECT * FROM maintenance_records ORDER BY id DESC;");
}

export function searchRecords(query: string) {
  return db.getAllSync<{
    id: number;
    serviceType: string;
    date: string;
    mileageAtService: number;
    cost: number;
    notes: string;
  }>(
    `SELECT * FROM maintenance_records
     WHERE serviceType LIKE ? OR notes LIKE ? OR date LIKE ?
     ORDER BY id DESC;`,
    [`%${query}%`, `%${query}%`, `%${query}%`],
  );
}

export function updateRecord(
  id: number,
  record: {
    serviceType: string;
    date: string;
    mileageAtService: number;
    cost: number;
    notes: string;
  },
) {
  db.runSync(
    `UPDATE maintenance_records
     SET serviceType=?, date=?, mileageAtService=?, cost=?, notes=?
     WHERE id=?;`,
    [
      record.serviceType,
      record.date,
      record.mileageAtService,
      record.cost,
      record.notes,
      id,
    ],
  );
}

export function deleteRecord(id: number) {
  db.runSync("DELETE FROM maintenance_records WHERE id=?;", [id]);
}

export function getTotalSpent(): number {
  const result = db.getFirstSync<{ total: number }>(
    "SELECT SUM(cost) as total FROM maintenance_records;",
  );
  return result?.total ?? 0;
}

// ── Fuel Logs CRUD ────────────────────────────────────────────────────────────

export function insertFuelLog(log: {
  liters: number;
  costPerLiter: number;
  totalCost: number;
  mileageAtFillup: number;
  date: string;
  stationName?: string;
}) {
  const vehicle = getVehicle();
  const vehicleId = vehicle?.id ?? 1;
  db.runSync(
    `INSERT INTO fuel_logs
      (vehicle_id, liters, cost_per_liter, total_cost,
       mileage_at_fillup, date, station_name)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      vehicleId,
      log.liters,
      log.costPerLiter,
      log.totalCost,
      log.mileageAtFillup,
      log.date,
      log.stationName ?? null,
    ],
  );
}

export function getAllFuelLogs() {
  return db.getAllSync<{
    id: number;
    liters: number;
    cost_per_liter: number;
    total_cost: number;
    mileage_at_fillup: number;
    date: string;
    station_name: string;
  }>("SELECT * FROM fuel_logs ORDER BY id DESC;");
}

export function deleteFuelLog(id: number) {
  db.runSync("DELETE FROM fuel_logs WHERE id=?;", [id]);
}

export function getTotalFuelSpent(): number {
  const result = db.getFirstSync<{ total: number }>(
    "SELECT SUM(total_cost) as total FROM fuel_logs;",
  );
  return result?.total ?? 0;
}

export function getVehicleFullHistory() {
  // JOIN query — maintenance + fuel logs together
  return db.getAllSync<{
    type: string;
    serviceType: string;
    date: string;
    cost: number;
    mileage: number;
    notes: string;
  }>(
    `SELECT 'maintenance' as type, serviceType, date, cost,
            mileageAtService as mileage, notes
     FROM maintenance_records
     UNION ALL
     SELECT 'fuel' as type, 'Fuel Fill-up' as serviceType, date,
            total_cost as cost, mileage_at_fillup as mileage,
            station_name as notes
     FROM fuel_logs
     ORDER BY date DESC;`,
  );
}

export { db };
