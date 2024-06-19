class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;
  private token: string | null;

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.0.0"; // Initial version below 1.2.0 for demonstration
    this.token = null;
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      if (response.status === 426) {
        throw new Error("Please update your client application to the latest version.");
      }
      throw new Error("Network response was not ok");
    }

    return response.json();
  }

  public setToken(token: string) {
    this.token = token;
  }

  public updateAppVersion(version: string) {
    this.appVersion = version;
  }
}

export default APIService.getInstance();
