export interface QuantityInput {
  firstValue: number;
  firstUnit: string;
  firstMeasurementType: string;
  secondValue: number;
  secondUnit: string;
  secondMeasurementType: string;
  targetUnit?: string;
}

export interface QuantityResponse {
  firstValue: number;
  firstUnit: string;
  firstMeasurementType: string;
  secondValue: number;
  secondUnit: string;
  secondMeasurementType: string;
  operation: string;
  resultString: string;
  resultValue: number;
  resultUnit: string;
  resultMeasurementType: string;
  errorMessage: string;
  hasError: boolean;
}

export interface HistoryItem {
  operation: string;
  firstUnit: string;
  secondUnit: string;
  resultString: string;
  firstMeasurementType: string;
  hasError: boolean;
  errorMessage: string;
  timestamp: string;
}