// ─── MileWise Global State Context (SQLite powered) ──────────────────────────
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  deleteRecord as dbDeleteRecord,
  getAllRecords,
  getTotalSpent,
  getVehicle,
  insertRecord,
  saveVehicle,
} from "../database/db";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Vehicle {
  vehicleName: string;
  manufacturer: string;
  model: string;
  year: string;
  registrationNumber: string;
  currentMileage: number;
}

export interface MaintenanceRecord {
  id: number;
  serviceType: string;
  date: string;
  mileageAtService: number;
  cost: number;
  notes: string;
}

export interface ReminderItem {
  id: string;
  name: string;
  icon: string;
  intervalKm: number;
  lastServiceMileage: number;
  estimatedCost: number;
}

interface GlobalStateType {
  userVehicle: Vehicle | null;
  setUserVehicle: (v: Vehicle) => void;
  maintenanceRecords: MaintenanceRecord[];
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, "id">) => void;
  deleteMaintenanceRecord: (id: number) => void;
  refreshRecords: () => void;
  reminders: ReminderItem[];
  totalSpent: number;
  nextServiceKm: number;
  isLoading: boolean;
}

// ── Default Reminders ─────────────────────────────────────────────────────────
const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: "r1",
    name: "Engine Oil",
    icon: "🔧",
    intervalKm: 5000,
    lastServiceMileage: 80000,
    estimatedCost: 5000,
  },
  {
    id: "r2",
    name: "Air Filter",
    icon: "🌀",
    intervalKm: 15000,
    lastServiceMileage: 70000,
    estimatedCost: 3500,
  },
  {
    id: "r3",
    name: "Spark Plugs",
    icon: "⚡",
    intervalKm: 30000,
    lastServiceMileage: 65000,
    estimatedCost: 6000,
  },
  {
    id: "r4",
    name: "Brake Pads",
    icon: "🛑",
    intervalKm: 40000,
    lastServiceMileage: 65000,
    estimatedCost: 12000,
  },
  {
    id: "r5",
    name: "Tires",
    icon: "🛞",
    intervalKm: 50000,
    lastServiceMileage: 40000,
    estimatedCost: 32000,
  },
  {
    id: "r6",
    name: "Shock Absorbers",
    icon: "🔩",
    intervalKm: 60000,
    lastServiceMileage: 30000,
    estimatedCost: 18000,
  },
];

// ── Context ───────────────────────────────────────────────────────────────────
const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [userVehicle, setUserVehicleState] = useState<Vehicle | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [reminders] = useState<ReminderItem[]>(DEFAULT_REMINDERS);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load data from SQLite on startup ────────────────────────────────────────
  useEffect(() => {
    loadAllData();
  }, []);

  function loadAllData() {
    setIsLoading(true);
    try {
      // Load vehicle
      const vehicle = getVehicle();
      if (vehicle) {
        setUserVehicleState({
          vehicleName: vehicle.vehicleName,
          manufacturer: vehicle.manufacturer,
          model: vehicle.model,
          year: vehicle.year,
          registrationNumber: vehicle.registrationNumber,
          currentMileage: vehicle.currentMileage,
        });
      }
      // Load records
      const records = getAllRecords();
      setMaintenanceRecords(records);
      // Load total
      setTotalSpent(getTotalSpent());
    } catch (e) {
      console.error("DB load error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  function refreshRecords() {
    const records = getAllRecords();
    setMaintenanceRecords(records);
    setTotalSpent(getTotalSpent());
  }

  function setUserVehicle(v: Vehicle) {
    saveVehicle(v);
    setUserVehicleState(v);
  }

  function addMaintenanceRecord(record: Omit<MaintenanceRecord, "id">) {
    insertRecord(record);
    refreshRecords();
  }

  function deleteMaintenanceRecord(id: number) {
    dbDeleteRecord(id);
    refreshRecords();
  }

  // ── Derived: next service km ─────────────────────────────────────────────
  const nextServiceKm = useMemo(() => {
    if (!userVehicle) return 0;
    const oil = reminders.find((r) => r.id === "r1");
    if (!oil) return 0;
    const nextAt = oil.lastServiceMileage + oil.intervalKm;
    return Math.max(0, nextAt - userVehicle.currentMileage);
  }, [userVehicle, reminders]);

  return (
    <GlobalContext.Provider
      value={{
        userVehicle,
        setUserVehicle,
        maintenanceRecords,
        addMaintenanceRecord,
        deleteMaintenanceRecord,
        refreshRecords,
        reminders,
        totalSpent,
        nextServiceKm,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useGlobal(): GlobalStateType {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
  return ctx;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatKES(amount: number): string {
  return `KES ${Number(amount).toLocaleString("en-KE")}`;
}

export type ReminderStatus = "URGENT" | "SOON" | "OK";

export function getReminderStatus(remainingKm: number): ReminderStatus {
  if (remainingKm <= 500) return "URGENT";
  if (remainingKm <= 3000) return "SOON";
  return "OK";
}
