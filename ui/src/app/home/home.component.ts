import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {Subscription} from "rxjs";
import {NotificationModel} from "../models/NotificationModel";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private subscription : Subscription | undefined;
  public notifications : NotificationModel[] = [];
constructor(private notificationService : NotificationService) {
}
ngOnInit()
{
  this.subscription = this.notificationService.listenToEvent("message").
  subscribe
  (
    (data) =>
    {
      let model = new NotificationModel();
      model.headLine = data.headLine;
      model.body = data.body;
      this.notifications.push(model);
    }
  )
}
}
