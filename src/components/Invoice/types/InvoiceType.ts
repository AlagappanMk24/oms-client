import { Customer } from "../../Customer/CustomerType";

export interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDue: string;
  paymentDue: string;
  notes?: string;
  discount: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  fileAttachmentPath?: string;
  customerId: number;
  locationId: number;
  orderId?: number;
  invoiceItems: InvoiceItem[];
  invoiceAttachments: InvoiceAttachment[];
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  location : Location;
  status : string;
  invoiceStatus : string;
}

// Define the type for an item
export interface InvoiceItem {
  id: number;
  service: string;
  description: string;
  unit: number;
  price: number;
  amount: number;
  invoiceId: number;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}

export interface Timezone {
  id: number;
  name: string;
  utcOffset: string;
  utcOffsetString: string;
  abbreviation: string;
}

export interface Location {
  id: number;
  companyName : string;
  email :string;
  phone : string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  currencyId: number;
  currency: Currency;
  timezoneId: number;
  timezone: Timezone;
  logo: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface InvoiceAttachment {
  id: number;
  attachmentName: string;
  attachmentContent: string;
  invoiceId: number;
}

