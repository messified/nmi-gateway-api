import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingRequest, RawRequest } from './request.interface';
import * as querystring from 'querystring';
import * as https from 'https';
import * as url from 'url';

@Injectable()
export class DirectPostService {
  url: string;
  securityKey: string;
  billing: any[];
  shipping: any[];
  response: any;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.securityKey = this.configService.get('API_KEY');
    this.url = this.configService.get('NMI_TRANSACT_URL');
  }

  async processPayment(rawRequest: RawRequest): Promise<any> {
    try {
      const incomingRequest = this.parseRawRequest(rawRequest);
      const billing = incomingRequest.billingInfo;
      const paymentInfo = incomingRequest.paymentInfo;

      this.setBilling(billing);

      const saleRequest = this.generateSaleRequest(paymentInfo);

      return await this.doRequest(saleRequest);
    } catch (e) {
      throw e;
    }
  }

  private generateSaleRequest(paymentInfo): object {
    const requestOptions = {
      type: 'sale',
      amount: paymentInfo.amount,
      ccnumber: paymentInfo.ccnumber,
      ccexp: paymentInfo.ccexp,
      cvv: paymentInfo.cvv,
    };

    return Object.assign(requestOptions, this.billing);
  }

  private async doRequest(postData) {
    const hostName = 'secure.networkmerchants.com';
    const path = '/api/transact.php';

    postData.security_key = this.securityKey;
    postData = querystring.stringify(postData);

    const options = {
      hostname: hostName,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, response => {
        response.on('data', chunk => {
          const params = new URLSearchParams(`${chunk}`);
          this.response = {
            response: params.get('response'),
            response_text: params.get('responsetext'),
            response_code: params.get('response_code'),
            transaction_id: params.get('transactionid'),
          };
        });
        response.on('end', () => {
          resolve(this.response);
        });
      });

      req.on('error', e => {
        reject(e.message);
      });

      req.write(postData);
      req.end();
    });
  }

  private async sendDirectPostRequest(data: any): Promise<any> {
    try {
      data.security_key = this.securityKey;
      const queryData = querystring.stringify(data);

      const options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(queryData),
        },
      };

      return await this.httpService.post(this.url, data, options).toPromise();
    } catch (e) {
      throw e;
    }
  }

  private setBilling(billingInformation): any {
    const validBillingKeys = [
      'first_name',
      'last_name',
      'company',
      'address1',
      'address2',
      'city',
      'state',
      'zip',
      'country',
      'phone',
      'fax',
      'email',
    ];

    for (const key in billingInformation) {
      if (!validBillingKeys.includes(key)) {
        throw new Error(`Invalid key provided in billingInformation. '${key}'
            is not a valid billing parameter.`);
      }
    }

    this.billing = billingInformation;
  }

  private setShipping(shippingInformation): any {
    const validShippingKeys = [
      'shipping_first_name',
      'shipping_last_name',
      'shipping_company',
      'shipping_address1',
      'address2',
      'shipping_city',
      'shipping_state',
      'shipping_zip',
      'shipping_country',
      'shipping_email',
    ];

    for (const key in shippingInformation) {
      if (!validShippingKeys.includes(key)) {
        throw new Error(`Invalid key provided in shippingInformation. '${key}'
            is not a valid shipping parameter.`);
      }
    }

    this.shipping = shippingInformation;
  }

  private parseRawRequest(rawRequest: RawRequest) {
    return {
      billingInfo: {
        first_name: rawRequest.first_name,
        last_name: rawRequest.last_name,
        address1: rawRequest.address1,
        address2: rawRequest.address2,
        city: rawRequest.city,
        state: rawRequest.state,
        zip: rawRequest.zip,
        country: rawRequest.country,
        phone: rawRequest.phone,
        email: rawRequest.email,
      },
      paymentInfo: {
        type: 'sale',
        amount: rawRequest.amount,
        ccnumber: rawRequest.cc_number,
        ccexp: `${rawRequest.month}/${rawRequest.year}`,
        cvv: rawRequest.cvv,
      },
    };
  }
}
