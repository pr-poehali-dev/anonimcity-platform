const AUTH_API = 'https://functions.poehali.dev/82265bd0-62b8-467c-b764-e7667e7dde1a';

export interface AuthResponse {
  success: boolean;
  user_id?: number;
  login?: string;
  session_token?: string;
  error?: string;
}

export async function registerUser(login: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API}?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function loginUser(login: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API}?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
