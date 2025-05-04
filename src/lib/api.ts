
import { fetchWithAuth } from "./auth";
import { Category, Charity, CHARITY_STATUS, Donation, EventEntity, Transaction, Volunteer } from "@/types";

// Charities API
export async function getAllCharities(status?: CHARITY_STATUS): Promise<Charity[]> {
  const url = status ? `/charity/all?charityStatus=${status}` : "/charity/all";
  return fetchWithAuth(url);
}

export async function getCharity(id: number): Promise<Charity> {
  return fetchWithAuth(`/charity?id=${id}`);
}

export async function deleteCharity(id: number): Promise<void> {
  return fetchWithAuth(`/charity/soft/${id}`, { method: "DELETE" });
}

export async function updateCharity(charity: Partial<Charity> & { id: number }): Promise<Charity> {
  return fetchWithAuth("/charity", {
    method: "PATCH",
    body: JSON.stringify(charity),
  });
}

export async function updateCharityStatus(id: number, status: CHARITY_STATUS): Promise<Charity> {
  return fetchWithAuth("/charity/admin-update", {
    method: "PATCH",
    body: JSON.stringify({ id, status }),
  });
}

// Categories API
export async function getAllCategories(): Promise<Category[]> {
  return fetchWithAuth("/category/all");
}

export async function getCategory(id: number): Promise<Category> {
  return fetchWithAuth(`/category?id=${id}`);
}

export async function createCategory(name: string): Promise<Category> {
  return fetchWithAuth("/category", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  return fetchWithAuth("/category", {
    method: "PATCH",
    body: JSON.stringify({ id, name }),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return fetchWithAuth(`/category/soft/${id}`, { method: "DELETE" });
}

// Events API
export async function getAllEvents(charityId?: number): Promise<EventEntity[]> {
  const url = charityId ? `/event/all?charityId=${charityId}` : "/event/all";
  return fetchWithAuth(url);
}

export async function getEvent(id: number): Promise<EventEntity> {
  return fetchWithAuth(`/event?id=${id}`);
}

export async function updateEvent(event: Partial<EventEntity> & { id: number }): Promise<EventEntity> {
  return fetchWithAuth("/event", {
    method: "PATCH",
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(id: number): Promise<void> {
  return fetchWithAuth(`/event/soft/${id}`, { method: "DELETE" });
}

// Donations API
export async function getAllDonations(categoryId?: number): Promise<Donation[]> {
  const url = categoryId ? `/donation/all?categoryId=${categoryId}` : "/donation/all";
  return fetchWithAuth(url);
}

export async function getDonation(id: number): Promise<Donation> {
  return fetchWithAuth(`/donation?id=${id}`);
}

export async function updateDonation(donation: Partial<Donation> & { id: number }): Promise<Donation> {
  return fetchWithAuth("/donation", {
    method: "PATCH",
    body: JSON.stringify(donation),
  });
}

export async function deleteDonation(id: number): Promise<void> {
  return fetchWithAuth(`/donation/soft/${id}`, { method: "DELETE" });
}

// Transactions API
export async function getAllTransactions(): Promise<Transaction[]> {
  return fetchWithAuth("/transaction/all");
}

export async function getCharityTransactions(charityId: number): Promise<Transaction[]> {
  return fetchWithAuth(`/transaction?charityId=${charityId}`);
}

export async function toggleCharityFundReceiving(charityId: number, canReceive: boolean): Promise<Charity> {
  return fetchWithAuth(`/transaction/charity/${charityId}/toggle?canReceive=${canReceive}`, {
    method: "PATCH",
  });
}

// Payment Method Utilities
export const PAYMENT_METHODS = ["VISA", "MASTERCARD"] as const;
export type PaymentMethodType = "VISA" | "MASTERCARD";

// Volunteers API
export async function getEventVolunteers(eventId: number): Promise<Volunteer[]> {
  return fetchWithAuth(`/volunteer/event/${eventId}`);
}

export async function updateVolunteerStatus(volunteerId: number, status: "ACCEPTED" | "REJECTED" | "IDLE"): Promise<Volunteer> {
  return fetchWithAuth(`/volunteer/${volunteerId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
