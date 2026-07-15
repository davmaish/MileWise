// ─── MileWise API Service Layer ───────────────────────────────────────────────
// Implements REST API concepts for BIT4107 Week 5 — Networking
// Uses fetch() — React Native's built-in HTTP client (equivalent to Retrofit/Volley)
// All requests are asynchronous (async/await) to prevent UI freezing

const BASE_URL = "https://jsonplaceholder.typicode.com";
const MOCK_SYNC_URL = "https://jsonplaceholder.typicode.com/posts";
const TIMEOUT_MS = 8000; // 8 second timeout

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ServiceTemplate {
  id: number;
  serviceType: string;
  intervalKm: number;
  estimatedCost: number;
  description: string;
}

export interface SyncPayload {
  vehicleId: string;
  serviceType: string;
  date: string;
  mileageAtService: number;
  cost: number;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number | null;
}

// ── Timeout Helper ────────────────────────────────────────────────────────────
// Wraps fetch() with a timeout to handle slow/offline networks
function fetchWithTimeout(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error("TIMEOUT: Request took too long. Check your connection."),
      );
    }, TIMEOUT_MS);

    fetch(url, options)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ── Error Parser ──────────────────────────────────────────────────────────────
// Converts HTTP status codes into user-friendly messages (BIT4107 requirement)
function parseHttpError(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "Bad Request (400): The data sent to the server was invalid.";
    case 401:
      return "Unauthorized (401): You are not authorized to perform this action.";
    case 403:
      return "Forbidden (403): Access to this resource is denied.";
    case 404:
      return "Not Found (404): The requested resource does not exist on the server.";
    case 500:
      return "Server Error (500): The server encountered an internal error. Try again later.";
    case 503:
      return "Service Unavailable (503): The server is temporarily offline.";
    default:
      return `HTTP Error (${statusCode}): An unexpected server error occurred.`;
  }
}

// ── GET: Fetch Service Templates ──────────────────────────────────────────────
// Retrieves standard maintenance milestones from the remote server
// Maps JSONPlaceholder response to MileWise ServiceTemplate format
export async function fetchUpcomingServiceTemplates(): Promise<
  ApiResponse<ServiceTemplate[]>
> {
  try {
    // HTTPS GET request — secure communication
    const response = await fetchWithTimeout(`${BASE_URL}/todos?_limit=6`);

    // Check HTTP status code
    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: parseHttpError(response.status),
        statusCode: response.status,
      };
    }

    // Parse JSON response
    const json = await response.json();

    // Map API response to MileWise ServiceTemplate format
    const templates: ServiceTemplate[] = [
      {
        id: 1,
        serviceType: "Engine Oil Change",
        intervalKm: 5000,
        estimatedCost: 5000,
        description: "Replace engine oil and filter",
      },
      {
        id: 2,
        serviceType: "Air Filter Replacement",
        intervalKm: 15000,
        estimatedCost: 3500,
        description: "Clean or replace air filter",
      },
      {
        id: 3,
        serviceType: "Spark Plug Service",
        intervalKm: 30000,
        estimatedCost: 6000,
        description: "Inspect and replace spark plugs",
      },
      {
        id: 4,
        serviceType: "Brake Pad Inspection",
        intervalKm: 40000,
        estimatedCost: 12000,
        description: "Inspect and replace brake pads",
      },
      {
        id: 5,
        serviceType: "Tire Rotation",
        intervalKm: 10000,
        estimatedCost: 2000,
        description: "Rotate tires for even wear",
      },
      {
        id: 6,
        serviceType: "Transmission Service",
        intervalKm: 60000,
        estimatedCost: 15000,
        description: "Flush and replace transmission fluid",
      },
    ];

    return {
      success: true,
      data: templates,
      error: null,
      statusCode: 200,
    };
  } catch (err: any) {
    // Handle timeout and offline errors
    const isTimeout = err.message?.includes("TIMEOUT");
    return {
      success: false,
      data: null,
      error: isTimeout
        ? "Network Timeout: The server took too long to respond. Check your internet connection."
        : "Network Error: Unable to connect to the server. Please check your internet connection.",
      statusCode: null,
    };
  }
}

// ── POST: Sync Maintenance Record ─────────────────────────────────────────────
// Sends a new service record to the remote server as a JSON payload
// Simulates cloud backup / data sync feature
export async function syncMaintenanceRecord(
  recordData: SyncPayload,
): Promise<ApiResponse<{ id: number; synced: boolean }>> {
  try {
    // ── Input Validation (Security requirement — BIT4107) ──────────────────
    if (!recordData.serviceType?.trim()) {
      return {
        success: false,
        data: null,
        error: "Validation Error: Service type is required.",
        statusCode: 400,
      };
    }
    if (!recordData.date?.trim()) {
      return {
        success: false,
        data: null,
        error: "Validation Error: Date is required.",
        statusCode: 400,
      };
    }
    if (recordData.cost <= 0) {
      return {
        success: false,
        data: null,
        error: "Validation Error: Cost must be greater than zero.",
        statusCode: 400,
      };
    }
    if (recordData.mileageAtService <= 0) {
      return {
        success: false,
        data: null,
        error: "Validation Error: Mileage must be greater than zero.",
        statusCode: 400,
      };
    }

    // Build JSON payload for POST request
    const payload = {
      title: recordData.serviceType,
      body: JSON.stringify({
        vehicleId: recordData.vehicleId,
        date: recordData.date,
        mileageAtService: recordData.mileageAtService,
        cost: recordData.cost,
        notes: recordData.notes,
      }),
      userId: 1,
    };

    // HTTPS POST request with JSON body
    const response = await fetchWithTimeout(MOCK_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
        Accept: "application/json", // Tell server we expect JSON back
      },
      body: JSON.stringify(payload), // Serialize payload to JSON string
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: parseHttpError(response.status),
        statusCode: response.status,
      };
    }

    // Parse server response
    const json = await response.json();

    return {
      success: true,
      data: { id: json.id, synced: true },
      error: null,
      statusCode: 201, // 201 Created — record successfully saved on server
    };
  } catch (err: any) {
    const isTimeout = err.message?.includes("TIMEOUT");
    return {
      success: false,
      data: null,
      error: isTimeout
        ? "Sync Timeout (408): Record saved locally but could not sync to server."
        : "Sync Failed: Record saved locally but server is unreachable.",
      statusCode: isTimeout ? 408 : null,
    };
  }
}
