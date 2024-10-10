export class ErrorResponseDto {
  code: number;
  message: string;
  details?: string[];
}

export class MetaDto {
  total_data: number;
  total_page: number;
  page_size: number;
  page: number;
}

export class BaseResponseDto<T = null> {
  success: boolean;
  request_id: string;
  data: T;
  meta?: MetaDto;
  error?: ErrorResponseDto;
}

export class BasePaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  meta: MetaDto;
  items: T[];
}
