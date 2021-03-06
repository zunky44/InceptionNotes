import { Injectable } from '@angular/core';
import { Config } from 'app/config.service';
import { SyncService } from 'app/sync.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WsService {

  private websocket: WebSocket;
  private pending: any[] = [];
  private lastReconnectAttempt: number;

  // Injections
  public syncService: SyncService;

  // Events
  public onBeforeOpen: Subject<any> = new Subject();

  constructor(private config: Config) {
  }

  public active() {
    return this.websocket && this.websocket.readyState === WebSocket.OPEN;
  }

  public reconnect() {
    if (new Date().getTime() - this.lastReconnectAttempt < 10000) {
      return;
    }

    this.lastReconnectAttempt = new Date().getTime();
    
    if (this.websocket) {
      if (this.websocket.readyState === WebSocket.OPEN || this.websocket.readyState === WebSocket.CONNECTING) {
        return;
      }
    }

    this.websocket = new WebSocket(this.config.getWebSocketUrl());
    this.websocket.onmessage = message => this.onMessage(message.data);
    this.websocket.onopen = () => this.onOpen();
    this.websocket.onclose = () => this.onClose();
  }

  public close() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  public send(events: any): boolean {
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      this.reconnect();
    }

    if (this.websocket.readyState !== WebSocket.OPEN) {
      this.pending.push(events);

      return false;
    }

    this.websocket.send(JSON.stringify(events));
    
    return true;
  }

  private onOpen() {
    this.onBeforeOpen.next();

    while(this.pending.length) {
      this.send(this.pending.shift());
    }

    this.syncService.open();
  }

  private onClose() {
    this.syncService.close();
  }

  private onMessage(message: string) {
    this.syncService.got(JSON.parse(message));
  }
}
