export type EVNetwork = 
  | 'Tata Power EZ Charge' 
  | 'Jio-bp pulse' 
  | 'ChargeZone' 
  | 'Statiq' 
  | 'Zeon' 
  | 'BPCL eDrive' 
  | 'Shell Recharge';

export type EVConnectorType = 'CCS2' | 'Type 2 AC' | 'GB/T';

export interface EVGunDetail {
  type: EVConnectorType;
  count: number;
  speedKw: number;
  status: 'Available' | 'In Use' | 'Maintenance';
}

export interface EVChargingStation {
  id: string;
  name: string;
  gujaratiName: string;
  network: EVNetwork;
  corridor: string;
  district: string;
  locationDesc: string;
  coordinates: [number, number]; // [lat, lng]
  totalPowerKw: number;
  guns: EVGunDetail[];
  reliabilityScore: number;       // e.g. 97%
  lastVerifiedWorking: string;    // e.g. 'Verified 2h ago by Punch EV driver'
  hasDgBackup: boolean;           // DG backup during rural feeder power cut
  hasCanopyShade: boolean;        // Prevents thermal throttling in Gujarat heat
  has24x7Security: boolean;
  tariffPerKwh: string;           // e.g. '₹21.50/kWh + GST'
  idleFee?: string;               // e.g. '₹1.50/min after 100%'
  paymentMethods: string[];
  amenities: {
    food: string;
    washroom: 'Clean & AC' | 'Clean Standard' | 'Basic';
    nightSafeForFamily: boolean;
    restLounge: boolean;
  };
  criticalRoadtripWarning?: string; // Lifeline warning for remote corridors
  troubleshootingTip: string;      // What to do if charger handshake fails
  supportPhone: string;
}
