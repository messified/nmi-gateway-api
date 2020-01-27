export interface RawRequest {
  test_mode: boolean;
  amount: string;
  cc_number: string;
  cvv: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  month: string;
  year: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  reference: string;
}

export interface IncomingRequest {
  billingInfo: {
    first_name: string;
    last_name: string;
    company?: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    fax?: string;
    email: string;
  };
  shippingInfo?: {
    shipping_first_name: string;
    shipping_last_name: string;
    shipping_company: string;
    shipping_address1: string;
    address2: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    shipping_country: string;
    shipping_email: string;
  };
  paymentInfo: {
    type: 'sale';
    amount: string;
    ccnumber: string;
    ccexp: string;
    cvv: string;
  };
}
