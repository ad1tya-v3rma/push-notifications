import { Component } from '@angular/core';
import {NotificationService} from "./services/notification.service";
import {OnInit} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';

  constructor(private notifcationService : NotificationService) {
  }

  ngOnInit()
  {

  }
}
