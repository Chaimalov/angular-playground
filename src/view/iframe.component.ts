import { Component, input } from '@angular/core';

@Component({
  selector: 'app-iframe',
  template: ` <iframe [src]="url()" (load)="onLoaded()?.(channel)"></iframe> `,
})
export class IFrameComponent {
  public url = input.required<string>();
  public onLoaded = input<(channel: MessageChannel) => void>();
  protected channel = new MessageChannel();
}
