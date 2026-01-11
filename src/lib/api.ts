const API_BASE = {
  auth: 'https://functions.poehali.dev/82265bd0-62b8-467c-b764-e7667e7dde1a',
  messages: 'https://functions.poehali.dev/0ec69c03-40fd-4089-854e-7e6a575f4c19',
  listings: 'https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89',
  support: 'https://functions.poehali.dev/5ee71053-8c99-45ac-ae98-99ccdb3b681d',
  admin: 'https://functions.poehali.dev/804dda5f-70e7-45e2-9dfb-e051e0f70c47',
  wallet: 'https://functions.poehali.dev/5755cd8a-ea9e-49d5-a18f-8956edb4b2a7',
  cryptoPayment: 'https://functions.poehali.dev/2441db33-301a-4fc0-8562-c375664cb244',
};

export async function registerUser(login: string, password: string) {
  try {
    const response = await fetch(`${API_BASE.auth}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function loginUser(login: string, password: string) {
  try {
    const response = await fetch(`${API_BASE.auth}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getMessages(userId: number) {
  try {
    const response = await fetch(API_BASE.messages, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
}

export async function sendMessage(userId: number, receiverId: number, subject: string, text: string) {
  try {
    const response = await fetch(API_BASE.messages, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({ receiver_id: receiverId, subject, text }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function markMessageAsRead(userId: number, messageId: number) {
  try {
    const response = await fetch(API_BASE.messages, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({ message_id: messageId }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Mark message as read error:', error);
    return false;
  }
}

export async function getListings(params?: { user_id?: number; category?: string; id?: number }) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.user_id) queryParams.append('user_id', String(params.user_id));
    if (params?.category) queryParams.append('category', params.category);
    if (params?.id) queryParams.append('id', String(params.id));
    
    const url = queryParams.toString() 
      ? `${API_BASE.listings}?${queryParams}`
      : API_BASE.listings;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get listings error:', error);
    return [];
  }
}

export async function createListing(userId: number, listing: {
  title: string;
  description: string;
  category: string;
  price?: number;
  currency?: string;
  location?: string;
  images?: string[];
}) {
  try {
    const response = await fetch(API_BASE.listings, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify(listing),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateListing(userId: number, listingId: number, updates: Partial<{
  title: string;
  description: string;
  price: number;
  location: string;
  status: string;
}>) {
  try {
    const response = await fetch(API_BASE.listings, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.dumps({ id: listingId, ...updates }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getSupportTickets(userId: number) {
  try {
    const response = await fetch(API_BASE.support, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch support tickets');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get support tickets error:', error);
    return [];
  }
}

export async function createSupportTicket(userId: number, subject: string, message: string) {
  try {
    const response = await fetch(API_BASE.support, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({ subject, message }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Admin API functions
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}

export async function createCategory(name: string, icon: string, color: string) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, icon, color }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateCategory(id: number, name: string, icon: string, color: string) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, icon, color }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteCategory(id: number) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=categories&id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Delete category error:', error);
    return false;
  }
}

export async function getModels() {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=models`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get models error:', error);
    return [];
  }
}

export async function createModel(model: {
  name: string;
  username?: string;
  age?: number;
  location?: string;
  rating?: number;
  reviews?: number;
  image_url?: string;
  status?: string;
}) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateModel(id: number, model: any) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=models`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...model }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteModel(id: number) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=models&id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Delete model error:', error);
    return false;
  }
}

export async function getApplications() {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=applications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get applications error:', error);
    return [];
  }
}

export async function createApplication(application: {
  name: string;
  age?: number;
  city?: string;
  telegram?: string;
  experience?: string;
}) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=applications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteApplication(id: number) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=applications&id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Delete application error:', error);
    return false;
  }
}

// Crypto Payment API functions
export async function createCryptoInvoice(
  userId: number,
  cryptoCurrency: string,
  amountRub: number,
  listingId?: number
) {
  try {
    const response = await fetch(`${API_BASE.cryptoPayment}?action=create_invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        crypto_currency: cryptoCurrency,
        amount_rub: amountRub,
        listing_id: listingId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function checkCryptoPaymentStatus(invoiceId: string) {
  try {
    const response = await fetch(
      `${API_BASE.cryptoPayment}?action=check_payment&invoice_id=${invoiceId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Check payment status error:', error);
    return null;
  }
}

export async function getAnonymousLetters(recipientLogin?: string) {
  try {
    const url = recipientLogin 
      ? `${API_BASE.admin}?resource=letters&recipient=${recipientLogin}`
      : `${API_BASE.admin}?resource=letters`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch letters');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get letters error:', error);
    return [];
  }
}

export async function sendAnonymousLetter(recipientLogin: string, message: string, senderLogin?: string) {
  try {
    const response = await fetch(`${API_BASE.admin}?resource=letters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_login: senderLogin, recipient_login: recipientLogin, message }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Wallet API functions
export async function getExchangeRates() {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=rates`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get exchange rates error:', error);
    return { rates: { BTC: 0, ETH: 0, USDT: 0 }, fallback: true };
  }
}

export async function getWalletBalance(userId: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get wallet balance error:', error);
    return { balance_rub: 0, balance_city: 0 };
  }
}

export async function getWalletTransactions(userId: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get transactions error:', error);
    return [];
  }
}

export async function depositToWallet(userId: number, amountCrypto: number, cryptoCurrency: string) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        amount_crypto: amountCrypto,
        crypto_currency: cryptoCurrency,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function exchangeCurrency(userId: number, fromCurrency: string, amount: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        from_currency: fromCurrency,
        amount: amount,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function createStaking(userId: number, amountCity: number, periodMonths: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=staking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        amount_city: amountCity,
        period_months: periodMonths,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getStakingList(userId: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=staking_list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch staking list');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get staking list error:', error);
    return [];
  }
}

export async function claimStakingRewards(userId: number, stakingId: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=claim_rewards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        staking_id: stakingId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function cancelStakingEarly(userId: number, stakingId: number) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=cancel_staking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        staking_id: stakingId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function withdrawFromWallet(userId: number, amount: number, currency: string, description?: string) {
  try {
    const response = await fetch(`${API_BASE.wallet}?action=withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId),
      },
      body: JSON.stringify({
        amount,
        currency,
        description: description || 'Списание средств',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}