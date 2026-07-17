import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Iproduct } from '../../interfaces/iproduct';
import { Productservice } from '../../services/productservice';
import { Snackservice } from '../../services/snackservice';

@Component({
  selector: 'app-wishlist',
  imports: [DecimalPipe, RouterLink, TranslateModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  products: Iproduct[] = [];

  constructor(
    private productService: Productservice,
    private snackService: Snackservice,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshWishlist();
  }

  goToDetails(productId: number): void {
    this.productService.selectProduct(productId);
    this.router.navigate(['/productDetails']);
  }

  remove(productId: number, event: Event): void {
    event.stopPropagation();
    this.productService.removeFromWishlist(productId);
    this.refreshWishlist();
    this.snackService.show(this.translate.instant('WISHLIST.MSG_REMOVED'), 'success');
  }

  addToCart(product: Iproduct, event: Event): void {
    event.stopPropagation();
    const alreadyInCart = this.productService.isInCart(product.id);
    const message = this.productService.addToCart(product);
    const type = alreadyInCart ? 'error' : 'success';
    this.snackService.show(message, type);
  }

  private refreshWishlist(): void {
    this.products = this.productService.getWishlistProducts();
  }
}
