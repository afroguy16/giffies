import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GifT } from './types';

@Component({
  selector: 'app-giffy',
  templateUrl: './giffy.component.html',
  styleUrls: ['./giffy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiffyComponent {
  @Input() props: GifT;
}
