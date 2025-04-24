
export type Role = "DONOR" | "CHARITY" | "ADMIN";

export type User = {
  id: number;
  email: string;
  role: Role;
  expoPushToken: string;
  charity?: Charity;
  donor?: Donor;
};

export type Donor = {
  id: number;
  phone: string;
  name: string;
  email: string;
  address: string;
  imgId?: string;
  imgUrl?: string;
  deletedAt?: Date | null;
  user: User;
  volunteers?: Volunteer[];
  transactions?: Transaction[];
};

export type Charity = {
  id: number;
  phone: string;
  name: string;
  email: string;
  address: string;
  deletedAt?: Date | null;
  imgUrl: string;
  imgId: string;
  user: User;
  donation?: Donation;
  events?: EventEntity[];
  transactions?: Transaction[];
  canReceiveFunds: boolean;
};

export type EventEntity = {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  deletedAt?: Date;
  charity: Charity;
  volunteers?: Volunteer[];
  imgsUrl?: string[];
  imgsId?: string[];
  finished: boolean;
};

export type Upload = {
  id: number;
  name: string;
  path: string;
  type: "IMAGE" | "DOCUMENT" | "VIDEO";
  mime: string;
  size: number;
  createDate: Date;
  updateDate: Date;
  deletedAt: Date | null;
};

export type Category = {
  id: number;
  name: string;
  donation?: Donation;
};

export type Donation = {
  id: number;
  name: string;
  quality: string;
  imgsUrl?: string[];
  imgsId?: string[];
  charity: Charity;
  category: Category;
  categoryId: number;
  user: User;
};

export type Volunteer = {
  id: number;
  donor: Donor;
  event: EventEntity;
  joinedAt: Date;
  role?: string;
  status: "ACCEPTED" | "IDLE" | "REJECTED";
};

export type PaymentMethod = "VISA" | "MASTERCARD";

export type Transaction = {
  id: number;
  donor: Donor;
  charity: Charity;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
};

export type Notification = {
  id: number;
  message: string;
  donor?: Donor;
  charity?: Charity;
  recipientExpoPushToken: string;
  createdAt: Date;
};
