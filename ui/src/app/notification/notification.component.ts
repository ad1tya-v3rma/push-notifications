import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {io} from "socket.io-client"
import {NotificationModel} from "../models/NotificationModel";
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  title = 'Notification'
  notification: string | null = "initial";
  private eventSubscription: Subscription | undefined;
  private socket = io('localhost:3000');
  @Input() model: NotificationModel | undefined;
  isVisible?: boolean;

  constructor() {
    this.model = new NotificationModel();
    this.model.headLine = 'Test Notification'
    this.model.body = 'This is the body of notification'
    this.isVisible = true;
  }

  ngOnInit(): void {
  }

  toggle() {
    this.isVisible = false;
  }

  ngOnDestroy(): void
  {
    this.isVisible = false
  }
}
