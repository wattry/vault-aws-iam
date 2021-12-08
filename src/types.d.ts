export interface AwsOptions {
  region: string | undefined;
}

export interface Options {
  AWS: AwsOptions;
  server: string;
  header?: string | null;
  port?: string | null;
  awsApiVersion?: string | null;
  action?: string | null;
  apiVersion?: string | null;
  stsUrl?: string | null;
}

export interface VaultLoginRequest {
  iam_request_url: string;
  iam_request_body: string;
  iam_request_headers: string;
}

export interface VaultLoginResponse {
  request_id: string,
  lease_id: string,
  renewable: boolean,
  lease_duration: number,
  data: any,
  wrap_info: any,
  warnings: any,
  auth: {
    client_token: string,
    accessor: string,
    policies: string[],
    token_policies: string[],
    metadata:
    {
      account_id: string,
      auth_type: string,
      canonical_arn: string,
      role_id: string
    },
    lease_duration: number,
    renewable: boolean,
    entity_id: string,
    token_type: string,
    orphan: boolean
  }
}

interface VaultReadResponse {
  data: any
}