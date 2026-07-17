import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Productservice } from '../../services/productservice';
import { ChangeDetectorRef } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { Snackservice } from '../../services/snackservice';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule,TranslateModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
   product!: Iproduct;
    relatedProducts: Iproduct[] = [];

  avgRating: number = 0;
totalReviews: number = 0;
ratingDistribution: { star: number, count: number, percentage: number }[] = [];

  constructor(
    private productService: Productservice,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _productService: Productservice,
    private Snackservice: Snackservice,
    private translate: TranslateService
  ) {
    effect(() => {
      const id = this.productService.selectedProductId();
      if (id !== null) {
        this.loadProduct(id);
      }
    });
  }


private loadProduct(id: number) {
  this.productService.getProductById(id).subscribe((res) => {
    this.product = res;
   window.scrollTo({ top: 0, behavior: 'smooth' }); //==> scroll to top of the page when a new product is loaded
    // clc average rating and distribution
    if (res.reviews && res.reviews.length > 0) {
      const total = res.reviews.reduce((acc, r) => acc + r.rating, 0);
      this.avgRating = total / res.reviews.length;
      this.totalReviews = res.reviews.length;

      // Rating distribution
      this.ratingDistribution = [5,4,3,2,1].map(star => {
        const count = res.reviews.filter(r => r.rating === star).length;
        return {
          star,
          count,
          percentage: (count / res.reviews.length) * 100
        };
      });
    }

    // Related products
    this.productService.getProductsByCategory(res.category).subscribe((related) => {
      this.relatedProducts = related.products
        .filter(p => p.id !== res.id)
        .slice(0, 4);
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  });
}

  goToDetails(id: number) {
    this.productService.selectProduct(id);
    this.router.navigate(['/productDetails']);
  }



 addToCart(product: Iproduct, event: Event) {
  event.stopPropagation();
  const alreadyInCart = this._productService.isInCart(product.id);
  let msg = this._productService.addToCart(product);
  this.Snackservice.show(msg, alreadyInCart ? 'error' : 'success');
}

 toggleWishlist(product: Iproduct, event: Event) {
  event.stopPropagation();
  const added = this._productService.toggleWishlist(product);
  const messageKey = added ? 'WISHLIST.MSG_ADDED' : 'WISHLIST.MSG_REMOVED';
  this.Snackservice.show(this.translate.instant(messageKey), 'success');
 }

 isWishlisted(productId: number): boolean {
  return this._productService.isWishlisted(productId);
 }

}
