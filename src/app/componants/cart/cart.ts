import { Component, OnInit } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { Productservice } from '../../services/productservice';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe,TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cart: (Iproduct & { quantity: number })[] = [];

  constructor(private _productService: Productservice, private router: Router) {}

  ngOnInit() {

     this.refreshCart();

  }
  get isCartEmpty(): boolean {
    return this.cart.length === 0;
  }
  private refreshCart() {
  this.cart = this._productService.getCartProducts().map(product => ({
    ...product,
    quantity: product.quantity !== undefined && product.quantity > 0 ? product.quantity : 1
  }));
}

  increaseQty(id: number) {
    this._productService.updateQuantity(id, 1);
     this.refreshCart();
  }

  decreaseQty(id: number) {
    this._productService.updateQuantity(id, -1);
     this.refreshCart();

  }

  removeItem(id: number) {
    this._productService.removeFromCart(id);

      this.refreshCart();
  }

  get total() {
    return this._productService.getCartTotal();
  }


  proceedToCheckout() {
  const total = this.total;
  // نبني payload صغير يحتوي المبلغ والطابع الزمنى
  const payload = {
    total: Number(total.toFixed(2)),
    ts: Date.now()
  };
  const clientRef = encodeURIComponent(btoa(JSON.stringify(payload))); // base64-uri

  // نختار الـ tier المناسب من السيرفس
  const tiers = this._productService.stripeTiers;
  let chosen = tiers.find(t => t.max !== null && total <= (t.max as number));

  if (!chosen) {
    // لو مفيش تطابق مع الحدود السابقة، نأخذ العنصر اللي max === null (الـ fallback)
    chosen = tiers.find(t => t.max === null) || tiers[tiers.length - 1];
  }

  if (!chosen || !chosen.url) {
    alert('Payment links غير مُعدة بشكل صحيح في Productservice.');
    return;
  }

  // نُضيف client_reference_id ليمكننا قراءة المبلغ لاحقاً في صفحة النجاح
  const url = `${chosen.url}${chosen.url.includes('?') ? '&' : '?'}client_reference_id=${clientRef}`;

  // افتح صفحة Stripe
  window.location.href = url;
}


}
