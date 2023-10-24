export interface ConsumptionProductsConsumptionDTO {
  name: string;
  quantity: number;
  price: number;
}

export interface ConsumptionInputDTO {
  products_consumption: ConsumptionProductsConsumptionDTO[];
  services_consumption: string[];
  total_amount: number;
  payment_type: string;
}

export interface ConsumptionOutputDTO extends ConsumptionInputDTO {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ParamsUpdateConsumptionDTO {
  id: string;
  total_amount?: number;
  payment_type?: string;
  products_consumption?: ConsumptionProductsConsumptionDTO[];
  services_consumption?: string[];
}
