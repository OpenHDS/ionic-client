export class Fieldworker{
  extId: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  uuid: string;
  processed?: boolean; // 0 for not sent, 1 for sent, 2 for sent, but with error
}
