// ─── MileWise SQLite Database Layer ──────────────────────────────────────────
import * as SQLite from "expo-sqlite";

// Open (or create) the database
const db = SQLite.openDatabaseSync("milewise.db");

// ── Initialize Tables ─────────────────────────────────────────────────────────
export function initDatabase() {
  db.execSync("PRAGMA foreign_keys = ON;");

  db.execSync(`
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

    CREATE TABLE IF NOT EXISTS maintenance_records (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id          INTEGER NOT NULL,
      serviceType         TEXT NOT NULL,
      date                TEXT NOT NULL,
      mileageAtService    INTEGER NOT NULL,
      cost                REAL NOT NULL,
      notes               TEXT,
      photo_uri           TEXT,
      latitude            REAL,
      longitude           REAL,
      service_location    TEXT,
      sync_status         INTEGER DEFAULT 0,
      FOREIGN KEY (vehicle_id)
        REFERENCES vehicle_profile(id)
        ON DELETE CASCADE
    );

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

    -- Performance: Index frequently queried columns
    CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle
      ON maintenance_records(vehicle_id);

    CREATE INDEX IF NOT EXISTS idx_maintenance_date
      ON maintenance_records(date);

    CREATE INDEX IF NOT EXISTS idx_maintenance_service
      ON maintenance_records(serviceType);

    CREATE INDEX IF NOT EXISTS idx_fuel_vehicle
      ON fuel_logs(vehicle_id);

    CREATE INDEX IF NOT EXISTS idx_fuel_date
      ON fuel_logs(date);
  `);
}

// ── Vehicle Profile CRUD ──────────────────────────────────────────────────────

export function saveVehicle(vehicle: {
  vehicleName: string;
  manufacturer: string;
  model: string;
  year: string;
  registrationNumber: string;
  currentMileage: number;
}) {
  // Always keep only one vehicle — delete existing first
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
  photoUri?: string;
  latitude?: number;
  longitude?: number;
  serviceLocation?: string;
}) {
  const vehicle = getVehicle();
  const vehicleId = vehicle?.id ?? 1;
  db.runSync(
    `INSERT INTO maintenance_records
      (vehicle_id, serviceType, date, mileageAtService, cost,
       notes, photo_uri, latitude, longitude, service_location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      vehicleId,
      record.serviceType,
      record.date,
      record.mileageAtService,
      record.cost,
      record.notes,
      record.photoUri ?? null,
      record.latitude ?? null,
      record.longitude ?? null,
      record.serviceLocation ?? null,
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
    photo_uri: string | null;
    latitude: number | null;
    longitude: number | null;
    service_location: string | null;
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

export { db };
