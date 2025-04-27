import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'intro-component',
    templateUrl: 'intro.component.html',
    imports: [MatButtonModule],
})
export class IntroComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
