import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notification: string | null = "initial";

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotification();
  }

  fetchNotification(): void {
    this.notificationService.getNotification().subscribe((data: any) => {
      this.notification = data.headLine;
      console.log('Received notification:', this.notification);
    });
  }
}
