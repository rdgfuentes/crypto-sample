import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoCompareCoin } from './crypto-compare-coin';
import { CryptoCompareResponse } from './crypto-compare-response';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoCompareService {
  constructor(private httpClient: HttpClient) {}

  coinlist(): Observable<CryptoCompareCoin[]> {
    return this.httpClient
      .get('https://min-api.cryptocompare.com/data/all/coinlist')
      .pipe(
        map(x => this.convertKeysToKebabCase(x)),
        filter(
          (x: CryptoCompareResponse) => x.response.toLowerCase() === 'success'
        ),
        map(x =>
          Object.values(x.data)
            .filter(y => y.sortOrder <= 100)
            // sort list
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(y => {
              y.imageUrl = x.baseImageUrl + y.imageUrl;
              return y;
            })
        )
      );
  }

  private convertKeysToKebabCase(obj) {
    const output = {};
    for (const i in obj) {
      if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
        output[
          i.substr(0, 1).toLowerCase() + i.substr(1)
        ] = this.convertKeysToKebabCase(obj[i]);
      } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
        output[i.substr(0, 1).toLowerCase() + i.substr(1)] = [];
        output[i.substr(0, 1).toLowerCase() + i.substr(1)].push(
          this.convertKeysToKebabCase(obj[i][0])
        );
      } else {
        output[i.substr(0, 1).toLowerCase() + i.substr(1)] = obj[i];
      }
    }
    return output;
  }
}
