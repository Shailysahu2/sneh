import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-3">Support</h1>
          <p class="text-gray-600">Contact us anytime. We’re happy to help.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            <p class="text-gray-700 leading-relaxed">
              Gali no 2, beside Hanuman Mandir, Punjab Bank Colony, Jabalpur,<br>
              GCF Jabalpur, Madhya Pradesh 482002
            </p>
          </div>
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
            <a class="text-blue-600 hover:text-blue-800 font-medium" href="tel:+919425323340">94253 23340</a>
          </div>
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <a class="text-blue-600 hover:text-blue-800 font-medium" href="mailto:snehkrishikendra&#64;gmail.com">snehkrishikendra&#64;gmail.com</a>
          </div>
        </div>

        <div class="mt-8 card overflow-hidden">
          <div class="relative" style="padding-bottom: 56.25%; height: 0;">
            <iframe
              title="SnehKrishiKendra Location"
              width="100%"
              height="100%"
              style="border:0; position:absolute; top:0; left:0;"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Gali%20no%202,%20beside%20Hanuman%20Mandir,%20Punjab%20Bank%20Colony,%20Jabalpur,%20GCF%20Jabalpur,%20Madhya%20Pradesh%20482002&t=&z=18&ie=UTF8&iwloc=near&output=embed">
            </iframe>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 items-center justify-between p-4">
            <div class="text-sm text-gray-600">Pin location for easy navigation</div>
            <div class="flex gap-3">
              <a class="btn-secondary"
                 target="_blank"
                 rel="noopener"
                 href="https://www.google.com/maps/place/Gali+no+2,+beside+Hanuman+Mandir,+Punjab+Bank+Colony,+Jabalpur,+GCF+Jabalpur,+Madhya+Pradesh+482002/">
                View on Google Maps
              </a>
              <a class="btn-primary"
                 target="_blank"
                 rel="noopener"
                 href="https://www.google.com/maps/dir/?api=1&destination=Gali%20no%202%2C%20beside%20Hanuman%20Mandir%2C%20Punjab%20Bank%20Colony%2C%20Jabalpur%2C%20GCF%20Jabalpur%2C%20Madhya%20Pradesh%20482002">
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <a routerLink="/" class="btn-primary">Back to Home</a>
        </div>
      </div>
    </div>
  `
})
export class SupportComponent {}