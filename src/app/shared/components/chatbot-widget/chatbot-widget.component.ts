import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

type ChatRole = 'user' | 'bot';
type ChatMessage = { role: ChatRole; text: string; ts: Date };

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="cbw-root" style="z-index: 10000;">
      <button
        type="button"
        class="cbw-fab"
        (click)="toggle()"
        aria-label="Open support chat"
        [attr.aria-expanded]="open"
        aria-controls="cbw-panel"
        title="Chat support"
      >
        <span class="cbw-fab__bg" aria-hidden="true"></span>
        <svg class="cbw-fab__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 8h10M7 12h6M21 12c0 4.418-4.03 8-9 8a10.6 10.6 0 0 1-3.57-.61L3 21l1.66-4.15A7.6 7.6 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="cbw-fab__status" aria-hidden="true"></span>
      </button>

      <section
        id="cbw-panel"
        *ngIf="open"
        class="cbw-panel anim-scale-in"
        role="dialog"
        aria-label="Support chat panel"
      >
        <header class="cbw-header">
          <div class="cbw-header__left">
            <div class="cbw-avatar" aria-hidden="true">
              <span class="cbw-avatar__ring"></span>
              <span class="cbw-avatar__dot"></span>
            </div>
            <div class="cbw-title">
              <div class="cbw-title__name">Support Bot</div>
              <div class="cbw-title__sub">Instant answers • Ticket in 1 tap</div>
            </div>
          </div>
          <button type="button" class="cbw-close" (click)="close()" aria-label="Close chat">
            <span aria-hidden="true">Close</span>
          </button>
        </header>

        <div class="cbw-body" role="log" aria-live="polite" aria-relevant="additions text">
          <div class="cbw-messages">
            <div *ngFor="let m of messages" class="cbw-row" [attr.data-role]="m.role">
              <div class="cbw-bubble">
                <div class="cbw-text">{{ m.text }}</div>
                <div class="cbw-meta">{{ m.ts | date: 'shortTime' }}</div>
              </div>
            </div>

            <div class="cbw-row" data-role="bot" *ngIf="sending">
              <div class="cbw-bubble cbw-bubble--typing" aria-label="Bot is typing">
                <span class="cbw-typing" aria-hidden="true">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer class="cbw-footer">
          <div class="cbw-composer">
            <input
              class="cbw-input"
              placeholder="Message Support…"
              [(ngModel)]="draft"
              (keydown.enter)="send()"
              [disabled]="sending"
              aria-label="Message"
            />
            <button
              type="button"
              class="cbw-send"
              (click)="send()"
              [disabled]="sending || !draft.trim()"
              aria-label="Send message"
            >
              Send
            </button>
          </div>

          <div class="cbw-actions">
            <button type="button" class="cbw-chip" (click)="quickAsk('Address')">Address</button>
            <button type="button" class="cbw-chip" (click)="quickAsk('Phone')">Phone</button>
            <button type="button" class="cbw-chip" (click)="quickAsk('Email')">Email</button>
            <button type="button" class="cbw-chip cbw-chip--primary" (click)="quickAsk('Raise ticket')">Raise ticket</button>
            <span class="cbw-incident" *ngIf="lastIncidentId">Incident: {{ lastIncidentId }}</span>
          </div>
        </footer>
      </section>
    </div>
  `
  ,
  styles: [
    `
      :host {
        --cbw-bg: rgba(255, 255, 255, 0.78);
        --cbw-bg-strong: rgba(255, 255, 255, 0.92);
        --cbw-stroke: rgba(17, 24, 39, 0.12);
        --cbw-stroke-strong: rgba(17, 24, 39, 0.18);
        --cbw-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
        --cbw-shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.12);
        --cbw-text: rgba(17, 24, 39, 0.92);
        --cbw-text-muted: rgba(17, 24, 39, 0.62);
        --cbw-accent-1: #22c55e;
        --cbw-accent-2: #3b82f6;
        --cbw-accent-3: #a855f7;
        --cbw-user: linear-gradient(135deg, #10b981 0%, #3b82f6 55%, #a855f7 110%);
        --cbw-radius: 22px;
        --cbw-font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-family: var(--cbw-font);
      }

      .cbw-root {
        position: relative;
        display: inline-block;
        pointer-events: none;
      }

      .cbw-root > * {
        pointer-events: auto;
      }

      .cbw-fab {
        position: relative;
        height: 52px;
        width: 52px;
        border-radius: 999px;
        border: 1px solid var(--cbw-stroke);
        background: rgba(255, 255, 255, 0.76);
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
        cursor: pointer;
        display: inline-grid;
        place-items: center;
        transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
        isolation: isolate;
      }

      .cbw-fab:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.22);
        background: rgba(255, 255, 255, 0.86);
      }

      .cbw-fab:active {
        transform: translateY(0px) scale(0.98);
      }

      .cbw-fab:focus-visible {
        outline: none;
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.22), 0 0 0 4px rgba(59, 130, 246, 0.25);
      }

      .cbw-fab__bg {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.28), rgba(59, 130, 246, 0.16), rgba(168, 85, 247, 0.1));
        filter: saturate(1.2);
        opacity: 0.85;
        z-index: 0;
      }

      .cbw-fab__icon {
        position: relative;
        z-index: 1;
        height: 22px;
        width: 22px;
        color: rgba(17, 24, 39, 0.92);
      }

      .cbw-fab__status {
        position: absolute;
        right: -1px;
        top: -1px;
        height: 14px;
        width: 14px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--cbw-accent-1), var(--cbw-accent-2));
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9), 0 10px 24px rgba(0, 0, 0, 0.22);
        z-index: 2;
      }

      .cbw-panel {
        position: absolute;
        right: 0;
        top: 56px;
        width: min(92vw, 420px);
        border-radius: var(--cbw-radius);
        border: 1px solid var(--cbw-stroke);
        background: var(--cbw-bg);
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        box-shadow: var(--cbw-shadow);
        overflow: hidden;
      }

      .cbw-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 14px 12px 14px;
        background: linear-gradient(
          180deg,
          rgba(17, 24, 39, 0.78) 0%,
          rgba(17, 24, 39, 0.62) 70%,
          rgba(17, 24, 39, 0.52) 100%
        );
        color: rgba(255, 255, 255, 0.94);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .cbw-header__left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .cbw-avatar {
        height: 34px;
        width: 34px;
        border-radius: 999px;
        position: relative;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.06));
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
        flex: 0 0 auto;
      }

      .cbw-avatar__ring {
        position: absolute;
        inset: -8px;
        border-radius: 999px;
        background: conic-gradient(from 220deg, rgba(34, 197, 94, 0.55), rgba(59, 130, 246, 0.6), rgba(168, 85, 247, 0.55), rgba(34, 197, 94, 0.55));
        filter: blur(10px);
        opacity: 0.55;
      }

      .cbw-avatar__dot {
        position: absolute;
        inset: 0;
        margin: auto;
        height: 10px;
        width: 10px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--cbw-accent-1), var(--cbw-accent-2));
        box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.55);
      }

      .cbw-title {
        min-width: 0;
      }

      .cbw-title__name {
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }

      .cbw-title__sub {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.76);
        line-height: 1.2;
        margin-top: 2px;
      }

      .cbw-close {
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.92);
        padding: 8px 10px;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.01em;
      }

      .cbw-close:hover {
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.24);
        transform: translateY(-1px);
      }

      .cbw-close:active {
        transform: translateY(0px) scale(0.98);
      }

      .cbw-close:focus-visible {
        outline: none;
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.18);
      }

      .cbw-body {
        padding: 14px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.82) 100%);
      }

      .cbw-messages {
        max-height: min(56vh, 360px);
        overflow: auto;
        padding-right: 6px;
        display: grid;
        gap: 10px;
      }

      .cbw-row {
        display: flex;
      }

      .cbw-row[data-role='user'] {
        justify-content: flex-end;
      }

      .cbw-row[data-role='bot'] {
        justify-content: flex-start;
      }

      .cbw-bubble {
        max-width: 86%;
        padding: 10px 12px;
        border-radius: 18px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: var(--cbw-shadow-soft);
        color: var(--cbw-text);
        transform: translateZ(0);
      }

      .cbw-row[data-role='user'] .cbw-bubble {
        border: 0;
        color: rgba(255, 255, 255, 0.96);
        background: var(--cbw-user);
        box-shadow: 0 14px 34px rgba(16, 185, 129, 0.22), 0 10px 28px rgba(59, 130, 246, 0.18);
      }

      .cbw-text {
        white-space: pre-wrap;
        font-size: 13.5px;
        line-height: 1.4;
        letter-spacing: -0.005em;
      }

      .cbw-meta {
        margin-top: 6px;
        font-size: 10px;
        opacity: 0.75;
      }

      .cbw-row[data-role='user'] .cbw-meta {
        opacity: 0.85;
      }

      .cbw-bubble--typing {
        padding: 12px 12px;
      }

      .cbw-typing {
        display: inline-flex;
        gap: 6px;
        align-items: center;
        height: 10px;
      }

      .cbw-typing span {
        height: 7px;
        width: 7px;
        border-radius: 999px;
        background: rgba(17, 24, 39, 0.32);
        animation: cbwDot 900ms ease-in-out infinite;
      }

      .cbw-typing span:nth-child(2) {
        animation-delay: 120ms;
      }

      .cbw-typing span:nth-child(3) {
        animation-delay: 240ms;
      }

      @keyframes cbwDot {
        0%,
        100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        50% {
          transform: translateY(-4px);
          opacity: 0.95;
        }
      }

      .cbw-footer {
        padding: 12px 14px 14px 14px;
        background: var(--cbw-bg-strong);
        border-top: 1px solid var(--cbw-stroke);
      }

      .cbw-composer {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .cbw-input {
        flex: 1 1 auto;
        height: 40px;
        border-radius: 14px;
        border: 1px solid var(--cbw-stroke-strong);
        background: rgba(255, 255, 255, 0.92);
        padding: 0 12px;
        font-size: 13.5px;
        color: var(--cbw-text);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
        transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
      }

      .cbw-input::placeholder {
        color: rgba(17, 24, 39, 0.45);
      }

      .cbw-input:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.45);
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.7);
      }

      .cbw-input:disabled {
        opacity: 0.75;
        cursor: not-allowed;
      }

      .cbw-send {
        height: 40px;
        padding: 0 14px;
        border-radius: 14px;
        border: 0;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.74));
        color: rgba(255, 255, 255, 0.96);
        font-weight: 700;
        font-size: 12.5px;
        letter-spacing: 0.02em;
        cursor: pointer;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
      }

      .cbw-send:hover {
        transform: translateY(-1px);
        box-shadow: 0 20px 54px rgba(0, 0, 0, 0.28);
        filter: saturate(1.05);
      }

      .cbw-send:active {
        transform: translateY(0px) scale(0.99);
      }

      .cbw-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.16);
      }

      .cbw-send:focus-visible {
        outline: none;
        box-shadow: 0 20px 54px rgba(0, 0, 0, 0.28), 0 0 0 4px rgba(59, 130, 246, 0.22);
      }

      .cbw-actions {
        margin-top: 10px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }

      .cbw-chip {
        height: 30px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--cbw-stroke);
        background: rgba(255, 255, 255, 0.9);
        color: rgba(17, 24, 39, 0.82);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease;
      }

      .cbw-chip:hover {
        transform: translateY(-1px);
        border-color: rgba(17, 24, 39, 0.18);
        box-shadow: 0 14px 24px rgba(0, 0, 0, 0.12);
      }

      .cbw-chip:active {
        transform: translateY(0px) scale(0.99);
      }

      .cbw-chip--primary {
        border: 0;
        color: rgba(255, 255, 255, 0.96);
        background: var(--cbw-user);
        box-shadow: 0 16px 34px rgba(59, 130, 246, 0.18);
      }

      .cbw-chip--primary:hover {
        box-shadow: 0 20px 44px rgba(59, 130, 246, 0.22);
      }

      .cbw-incident {
        margin-left: auto;
        font-size: 11px;
        color: var(--cbw-text-muted);
        padding: 0 2px;
      }

      @media (max-width: 420px) {
        .cbw-panel {
          top: 54px;
          width: min(94vw, 420px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .cbw-fab,
        .cbw-close,
        .cbw-send,
        .cbw-chip,
        .cbw-input {
          transition: none !important;
        }
        .cbw-typing span {
          animation: none !important;
          opacity: 0.8;
        }
      }
    `
  ]
})
export class ChatbotWidgetComponent {
  open = false;
  draft = '';
  sending = false;
  lastIncidentId: string | null = null;
  private readonly apiUrl = `${environment.apiUrl}/chatbot/search`;

  messages: ChatMessage[] = [
    {
      role: 'bot',
      text:
        "Hi! I’m the Support Bot.\n\nAsk about: address, phone, email, directions.\nOr type “raise ticket” to email us an incident.",
      ts: new Date()
    }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  quickAsk(text: string) {
    this.draft = text;
    this.send();
  }

  send() {
    const text = this.draft.trim();
    if (!text) return;

    this.draft = '';
    this.messages = [...this.messages, { role: 'user', text, ts: new Date() }];
    this.sending = true;

    const local = this.getLocalReply(text);
    if (local) {
      setTimeout(() => {
        this.messages = [...this.messages, { role: 'bot', text: local, ts: new Date() }];
        this.sending = false;
      }, 150);
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.messages = [
        ...this.messages,
        {
          role: 'bot',
          text: 'AI search is available after login. Please login to use AI support.',
          ts: new Date()
        }
      ];
      this.sending = false;
      return;
    }

    const history = this.messages.slice(-10).map((m) => ({ role: m.role, text: m.text }));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http
      .post<{ response: string }>(this.apiUrl, { query: text, history }, { headers })
      .subscribe({
        next: (res) => {
          const reply = (res?.response || '').trim() || 'No response received.';
          this.messages = [...this.messages, { role: 'bot', text: reply, ts: new Date() }];
          this.sending = false;
        },
        error: () => {
          this.messages = [
            ...this.messages,
            { role: 'bot', text: 'AI search failed right now. Please try again later.', ts: new Date() }
          ];
          this.sending = false;
        }
      });
  }

  private getLocalReply(userText: string): string | null {
    const q = userText.toLowerCase().trim();

    if (q.includes('raise') || q.includes('ticket') || q.includes('incident') || q.includes('complaint')) {
      this.raiseIncidentTicket();
      return 'Opening your email app to create an incident ticket with the chat transcript.';
    }

    if (q.includes('address') || q.includes('location') || q.includes('where')) {
      return (
        'Address:\nGali no 2, beside Hanuman Mandir, Punjab Bank Colony, Jabalpur,\nGCF Jabalpur, Madhya Pradesh 482002'
      );
    }

    if (q.includes('phone') || q.includes('call') || q.includes('mobile') || q.includes('number')) {
      return 'Phone: 94253 23340 / 0761-4010386';
    }

    if (q.includes('email') || q.includes('mail') || q.includes('gmail')) {
      return 'Email: snehkrishikendra@gmail.com';
    }

    if (q.includes('hours') || q.includes('timing') || q.includes('open') || q.includes('close')) {
      return 'For opening hours, please raise a ticket (type “raise ticket”) and we’ll confirm the latest timings.';
    }

    if (q.includes('directions') || q.includes('navigate') || q.includes('route')) {
      return 'Use the Support page “Get Directions” button to open Google Maps navigation.';
    }

    return null;
  }

  private raiseIncidentTicket() {
    const incidentId = this.makeIncidentId();
    this.lastIncidentId = incidentId;

    const subject = encodeURIComponent(`[Incident ${incidentId}] Support request`);
    const body = encodeURIComponent(this.buildTicketBody(incidentId));
    window.location.href = `mailto:snehkrishikendra@gmail.com?subject=${subject}&body=${body}`;
  }

  private buildTicketBody(incidentId: string): string {
    const transcript = this.messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Bot'} (${m.ts.toLocaleString()}):\n${m.text}\n`)
      .join('\n');

    return [
      `Incident ID: ${incidentId}`,
      '',
      'Please describe your issue (add details below):',
      '- Name:',
      '- Phone:',
      '- Preferred callback time:',
      '- Order/Invoice (if any):',
      '',
      '--- Chat transcript ---',
      transcript
    ].join('\n');
  }

  private makeIncidentId(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `SKK-${y}${m}${day}-${rand}`;
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.close();
  }
}

