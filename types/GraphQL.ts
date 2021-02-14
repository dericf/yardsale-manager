export interface UseQueryResponse {
  loading?: any;
  error?: any;
  data: any;
}

export interface HasuraQueryResponse {
  data?: {
    [name: string]: any;
  };
  errors?: Array<HasuraErrorObject>;
}

interface HasuraErrorObject {
  message: HasuraJWTExpiredErrorMessage;
  extensions?: any;
}

type HasuraJWTExpiredErrorMessage = 'Could not verify JWT: JWTExpired'