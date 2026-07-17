import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Productservice } from '../../services/productservice';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderService } from '../../services/loader-service';
@Component({
  selector: 'app-payed-componant',
  imports: [CommonModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './payed-componant.html',
  styleUrl: './payed-componant.css'
})
export class PayedComponant implements OnInit {


  total: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _productService: Productservice,
      private loader: LoaderService
  ) {}

  ngOnInit(): void {
    // قراءة client_reference_id من الرابط
    this.route.queryParams.subscribe(params => {
       this.loader.show();
      const ref = params['client_reference_id'];
      if (ref) {
        try {
          const decoded = JSON.parse(atob(decodeURIComponent(ref)));
          this.total = decoded.total;
        } catch {
          this.total = null;
        }
      }

      // مسح السلة بعد العودة من Stripe (لأن الدفع تم بنجاح)
      this._productService.clearCart();

      // بعد 5 ثواني رجّع المستخدم إلى الصفحة الرئيسية أو المنتجات
      setTimeout(async () => {
        try {
        await this.router.navigate(['/Home']);
      } finally {
        // تأكد من إخفاء الـ loader بعد navigation
        this.loader.hide();
      }      }, 5000);
    });
  }

}
