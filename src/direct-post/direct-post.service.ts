import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import { IncomingRequest } from './request.interface';

@Injectable()
export class DirectPostService {
  securityKey: string;
  billing: any[];
  shipping: any[];

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.securityKey = this.configService.get('API_KEY');
  }

  async processPayment(incomingRequest: IncomingRequest): Promise<any> {
    try {
      const billing = incomingRequest.billingInfo;
      const shipping = incomingRequest.shippingInfo;
      const paymentInfo = incomingRequest.paymentInfo;

      this.setBilling(billing);
      this.setShipping(shipping);

      const saleRequest = this.generateSaleRequest(paymentInfo);

      return await this.sendDirectPostRequest(saleRequest);
    } catch (e) {
      throw e;
    }
  }

  private generateSaleRequest(paymentInfo): object {
    const requestOptions = {
      type: 'sale',
      amount: paymentInfo.amount,
      ccnumber: paymentInfo.ccNum,
      ccexp: paymentInfo.ccExp,
      cvv: paymentInfo.cvv,
    };

    // Merge together all request options into one object
    return Object.assign(requestOptions, this.billing, this.shipping);
  }

  private async sendDirectPostRequest(data: any): Promise<any> {
    try {
      const url = 'https://secure.networkmerchants.com/api/transact.php';

      data.security_key = this.securityKey;
      data = querystring.stringify(data);

      const options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
        },
      };

      return await this.httpService.post(url, data, options).toPromise();
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
}
