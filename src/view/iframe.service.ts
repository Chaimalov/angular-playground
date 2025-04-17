import { Injectable, Injector, Type } from '@angular/core';
import { v4 } from 'uuid';
import { IFrameComponent } from './iframe.component';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';

export interface View {
  id: string;
  inputs: Record<string, unknown>;
  component: ComponentType<unknown>;
}

type IFrameInputs = { url: string; onLoaded?: (channel: MessageChannel) => void };

export class IFrame implements View {
  public readonly component = IFrameComponent;
  public readonly id = v4();
  constructor(public readonly inputs: IFrameInputs) {}
}

@Injectable({
  providedIn: 'root',
})
export class IFrameService {
  public create({ url, onLoaded }: IFrameInputs): void {
    const iframe = new IFrame({ url, onLoaded });
    new ComponentPortal(iframe.component);
  }
}
