import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GifT } from 'src/app/components/giffy/types';
import { giffies } from 'src/app/mocks/giffies';

@Component({
  selector: 'app-giffies',
  templateUrl: './giffies.component.html',
  styleUrls: ['./giffies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiffiesComponent {
  giffies = [...giffies];

  constructor() {}

  trackGiffies(index: number, giffies: GifT) {
    return giffies.id;
  }
}
