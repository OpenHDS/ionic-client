export interface Visit {
  uuid: string;
  extId: string;
  realVisit: number;
  roundNumber: number;
  visitDate: Date;
  collectedBy: string;
  visitLocation: string;
  processed?: boolean;
  errorReported?: boolean;
}
