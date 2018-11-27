export class Visit {
  uuid: string;
  extId: string;
  realVisit: number;
  roundNumber: number;
  visitDate: Date;
  collectedBy: any;
  visitLocation: any;
  deleted?:boolean;
  clientInsert?: number;
  processed?: boolean;
  status?: string;
  errorReported?: boolean;
  syncedWithServer?: boolean;
}
