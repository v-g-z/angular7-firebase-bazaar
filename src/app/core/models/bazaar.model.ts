export interface IBazaar {
    title: string;
    state: string;
    nbOfVendors: number;
    fee: number;
    margin: number;
  }
  export interface IBazaarId extends IBazaar { id: string; }
  
  