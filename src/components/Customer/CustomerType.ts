export interface Address {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  // Define the type for an customer
  export interface Customer {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: Address;
  }
  