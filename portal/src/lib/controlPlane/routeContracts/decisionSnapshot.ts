export interface RouteDecisionSnapshot<Status extends number, Body> {
  status: Status;
  body: Body;
}
