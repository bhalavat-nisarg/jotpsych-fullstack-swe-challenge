class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;
  private token: string | null;

  private constructor() {
    this.baseUrl = 'http://localhost:3002';
    this.appVersion = '1.2.1';
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
      'app-version': this.appVersion,
    };

    if (auth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 426) {
        throw new Error('Please update your client application to the latest version.');
      }
      throw new Error('Network response was not ok');
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
