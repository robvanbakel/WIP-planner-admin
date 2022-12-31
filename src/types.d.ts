export interface User {
  id: string;
  email: string;
  contract: number;
  createdAt: number;
  firstName: string;
  role: string;
  demo: true;
  lastName: string;
  feedToken: string;
  notes: string;
  status: string;
  phone: string;
  contractType: string;
}

export interface Shift {
  id: string;
  location: string;
  to: string;
  from: string;
  status: string;
  statusUpdated: string;
  notes: string;
  break: string;
  employeeId: string;
}

export interface Admin {
  id: string;
  roles: string[];
  suggestions: string[];
  shareWithEmployees: { shiftNotes: boolean; employeeNotes: boolean };
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  dateNotation: string;
}
