import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:3000/notify';  // URL of your backend API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch the latest notification
  getNotification(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
