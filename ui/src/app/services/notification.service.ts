import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:3000/notify';  // URL of your backend API endpoint
  private wsUrl = 'ws://localhost:3000'
  private socket: Socket = io('localhost:3000');

  constructor(private http: HttpClient) {
  }

  listenToEvent(eventName: string): Observable<any> {
    return new Observable((observer) => {
      /*this.socket.on(event, data => {
        observer.next(data); // Emit each incoming message to subscribers
      });*/

      this.socket.on('error', error => {
        observer.error(error); // Handle errors
      });

      this.socket.on('close', () => {
        observer.complete(); // Complete when the WebSocket closes
      });
      this.socket.on('message', message => {
        observer.next(message)
        }
      )
    });
  }

  // Method to fetch the latest notification
  getNotification(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
