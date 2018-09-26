export interface IBazaar {
  title: string;
  state: string;
  nbOfVendors: number;
  fee: number;
  margin: number;
  admin: string;
  access: string[];
}
export interface IBazaarId extends IBazaar { id: string; }
