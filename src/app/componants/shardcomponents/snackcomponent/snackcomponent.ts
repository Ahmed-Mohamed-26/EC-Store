import { Component, OnInit } from '@angular/core';
import { Snackservice, ToastMessage } from '../../../services/snackservice';

declare var bootstrap: any;

@Component({
  selector: 'app-snackcomponent',
  imports: [],
  templateUrl: './snackcomponent.html',
  styleUrl: './snackcomponent.css'
})
export class Snackcomponent implements OnInit {
  message: ToastMessage | null = null;

  constructor(private Snackservice: Snackservice) {}

  ngOnInit(): void {
    this.Snackservice.toastState$.subscribe((msg) => {
      if (msg) {
        this.message = msg;
        const toastElement = document.getElementById('liveToast');
        const toastBody = document.getElementById('toastMessage');
        if (toastElement && toastBody) {
          toastBody.textContent = msg.text;
          toastElement.classList.remove('bg-success', 'bg-danger', 'bg-info');

          if (msg.type === 'success') toastElement.classList.add('bg-success');
          else if (msg.type === 'error') toastElement.classList.add('bg-danger');
          else toastElement.classList.add('bg-info');

          const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
          toast.show();
        }
      }
    });
  }
}