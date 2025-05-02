import { Component } from '@angular/core';
import { RouteCardComponent } from '../../shared/components/route-card/route-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouteCardComponent],
    templateUrl: './home.component.html',
})
export class HomeComponent {}
