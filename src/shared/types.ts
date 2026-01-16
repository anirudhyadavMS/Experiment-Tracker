export interface Experiment {
  _id?: string;
  name: string;
  description: string;
  owner: string;
  status: 'running' | 'completed' | 'paused';
  startDate: Date | string;
  endDate?: Date | string;
  hypothesis: string;
  successMetrics: string[];
  targetAudience: string;
  variants: Variant[];
  results?: string;
  learnings?: string;
  businessImpact?: string;
  confidenceLevel?: 'low' | 'medium' | 'high';
  decision?: 'go' | 'no-go' | 'pending';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Variant {
  name: string;
  description: string;
  percentage: number;
}

export interface FilterCriteria {
  status?: 'running' | 'completed' | 'paused';
  owner?: string;
  startDateFrom?: Date | string;
  startDateTo?: Date | string;
  endDateFrom?: Date | string;
  endDateTo?: Date | string;
  decision?: 'go' | 'no-go' | 'pending';
  confidenceLevel?: 'low' | 'medium' | 'high';
}

export interface SortOptions {
  field: 'name' | 'startDate' | 'endDate' | 'status' | 'owner' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface SearchQuery {
  keywords: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
