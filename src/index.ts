import aws from 'aws-sdk';
import axios from 'axios';

import { Options, VaultLoginRequest, VaultReadResponse  } from './types';

export default class VaultAws {
  private options: Options;
  private stsClient: any;
  private server: string;
  private port: string | number;
  private action: string;
  private awsApiVersion: string;
  private vaultHeader: string;
  private stsUrl: string;
  private apiVersion: string;
  private url: string;
  private auth: any;

  constructor(options: Options) {
    this.options = options;
    this.server = options.server;
    this.port = options.port || '8200'
    this.action = options.action || 'GetCallerIdentity';
    this.awsApiVersion = options.awsApiVersion || '2011-06-15';
    this.vaultHeader = options.header || 'X-Vault-AWS-IAM-Server-ID';
    this.stsUrl = options.stsUrl || 'https://sts.amazonaws.com/';
    this.apiVersion = options.apiVersion || 'v1';
    this.url = `https://${this.server}:${this.port}/${this.apiVersion}`;
    this.stsClient = new aws.STS(options.AWS);
  }

  private getCallerIdentityRequest(): Promise<any> {
    const request = this.stsClient.getCallerIdentity();

    return new Promise((resolve) => {
      request.on('build', () => {
        request.httpRequest.headers[this.vaultHeader] = this.options.server;
      });

      resolve(request.send().request.httpRequest);
    });
  }

  private async getSignedRequest(): Promise<VaultLoginRequest> {
    const { headers, headersString = JSON.stringify(headers) } = await this.getCallerIdentityRequest();
    const body = `Action=${this.action}&Version=${this.awsApiVersion}`;
    const url = this.stsUrl;

    return {
      iam_request_url: Buffer.from(url).toString('base64'),
      iam_request_body: Buffer.from(body).toString('base64'),
      iam_request_headers: Buffer.from(headersString).toString('base64')
    }
  }

  public async login(role: string): Promise<string> {
    const request = await this.getSignedRequest();

    const { data } = await axios(`${this.url}/auth/aws/login`, {
      method: "POST",
      data: {
        role,
        iam_http_request_method: "POST",
        ...request
      }
    });

    this.auth = data.auth;

    return 'OK';
  }

  public async read(path: string): Promise<VaultReadResponse> {
    const { data } = await axios(`${this.url}/${path}`, {
      headers: {
        'X-Vault-Token': this.auth.client_token
      }
    });

    return data.data;
  }
}