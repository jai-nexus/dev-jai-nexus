import {
  normalizePortfolioStatusReadModel,
  readPortfolioStatusFromFutureApi,
} from "./portfolioStatusClient";
import type { PortfolioStatusFixture } from "./portfolioStatusFixture";

export type PortfolioStatusApiMockResponse =
  | Partial<PortfolioStatusFixture>
  | {
      data?: Partial<PortfolioStatusFixture>;
      portfolio_status?: Partial<PortfolioStatusFixture>;
      read_model?: Partial<PortfolioStatusFixture>;
    };

function hasWrappedReadModel(
  response: PortfolioStatusApiMockResponse,
): response is {
  data?: Partial<PortfolioStatusFixture>;
  portfolio_status?: Partial<PortfolioStatusFixture>;
  read_model?: Partial<PortfolioStatusFixture>;
} {
  return "data" in response || "portfolio_status" in response || "read_model" in response;
}

export function normalizeTestOnlyPortfolioStatusApiResponse(
  response: PortfolioStatusApiMockResponse = {},
): PortfolioStatusFixture {
  if (hasWrappedReadModel(response)) {
    return normalizePortfolioStatusReadModel(
      response.data ?? response.portfolio_status ?? response.read_model ?? {},
    );
  }

  return normalizePortfolioStatusReadModel(response);
}

export function readPortfolioStatusFromApiBoundaryForTestOnly(
  response: PortfolioStatusApiMockResponse,
): PortfolioStatusFixture {
  return normalizeTestOnlyPortfolioStatusApiResponse(response);
}

export function assertFutureApiSourceUnavailableForRuntime(): void {
  readPortfolioStatusFromFutureApi();
}
