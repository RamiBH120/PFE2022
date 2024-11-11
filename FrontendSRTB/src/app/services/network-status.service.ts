import { Injectable } from '@angular/core';
import {fromEvent, merge, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  constructor() { }

  checkNetworkStatus(networkStatus,networkStatus$) {
    networkStatus = navigator.onLine;
    networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        console.log('status', status);
        networkStatus = status;
      });
  }
}
