import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

type ChatRole = 'user' | 'bot';
type ChatMessage = { role: ChatRole; text: string; ts: Date };

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="relative" style="z-index: 10000;">
      <button
        type="button"
        class="relative inline-flex items-center justify-center h-10 w-10 rounded-full shadow-sm border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        (click)="toggle()"
        aria-label="Open support chat"
        [attr.aria-expanded]="open"
        aria-controls="navbar-chat-panel"
        title="Chat support"
      >
        <span
          class="absolute inset-0 rounded-full"
          style="background: radial-gradient(circle at 30% 30%, rgba(34,197,94,.22), rgba(59,130,246,.10), rgba(168,85,247,.06));"
        ></span>
        <svg class="relative h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 8h10M7 12h6M21 12c0 4.418-4.03 8-9 8a10.6 10.6 0 0 1-3.57-.61L3 21l1.66-4.15A7.6 7.6 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span
          class="absolute -top-1 -right-1 h-3 w-3 rounded-full"
          style="background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%); box-shadow: 0 0 0 2px white;"
        ></span>
      </button>

      <div
        id="navbar-chat-panel"
        *ngIf="open"
        class="absolute right-0 mt-3 w-[92vw] max-w-sm rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden anim-scale-in"
        style="width: min(92vw, 420px);"
        role="dialog"
        aria-label="Support chat panel"
      >
        <div class="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
          <div class="min-w-0">
            <div class="font-semibold leading-tight">Support Bot</div>
            <div class="text-xs text-gray-300 leading-tight">Ask anything or raise an incident</div>
          </div>
          <button type="button" class="text-sm text-gray-200 hover:text-white" (click)="close()">Close</button>
        </div>

        <div class="px-4 py-3 max-h-72 overflow-auto bg-gray-50">
          <div *ngFor="let m of messages" class="mb-3">
            <div class="flex" [class.justify-end]="m.role === 'user'" [class.justify-start]="m.role !== 'user'">
              <div
                class="rounded-2xl px-3 py-2 text-sm shadow-sm"
                style="max-width: 85%;"
                [class.bg-white]="m.role !== 'user'"
                [class.text-gray-900]="m.role !== 'user'"
                [class.border]="m.role !== 'user'"
                [class.border-gray-200]="m.role !== 'user'"
                [class.bg-green-600]="m.role === 'user'"
                [class.text-white]="m.role === 'user'"
              >
                <div class="whitespace-pre-wrap">{{ m.text }}</div>
                <div class="mt-1" style="font-size: 10px;" [class.text-gray-500]="m.role !== 'user'" [class.text-green-100]="m.role === 'user'">
                  {{ m.ts | date: 'shortTime' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 border-t border-gray-200 bg-white">
          <div class="flex gap-2">
            <input
              class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="Type your question…"
              [(ngModel)]="draft"
              (keydown.enter)="send()"
            />
            <button type="button" class="btn-primary whitespace-nowrap" (click)="send()" [disabled]="sending || !draft.trim()">
              Send
            </button>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" class="btn-secondary text-sm" (click)="quickAsk('Address')">Address</button>
            <button type="button" class="btn-secondary text-sm" (click)="quickAsk('Phone')">Phone</button>
            <button type="button" class="btn-secondary text-sm" (click)="quickAsk('Email')">Email</button>
            <button type="button" class="btn-secondary text-sm" (click)="quickAsk('Raise ticket')">Raise ticket</button>
            <span class="text-xs text-gray-500 ml-auto" *ngIf="lastIncidentId">Incident: {{ lastIncidentId }}</span>
          </div>
        </div>
      </div>
    </div>
  `
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

  constructor(private http: HttpClient) {}

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

    const history = this.messages.slice(-10).map((m) => ({ role: m.role, text: m.text }));
    this.http
      .post<{ response: string }>(this.apiUrl, { query: text, history })
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

