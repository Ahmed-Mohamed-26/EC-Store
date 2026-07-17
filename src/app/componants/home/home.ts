import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Productservice } from '../../services/productservice';
import { Snackservice } from '../../services/snackservice';
import { ChangeDetectorRef } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { Categories } from '../../interfaces/categories';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  products: Iproduct[] = [];
  categories: Categories[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' = 'featured';
  isAdmin: boolean = false; 
 //  Pagination variables
  limit: number = 30;
  skip: number = 0;
  total: number = 0;
  loading: boolean = false;
  isFiltering: boolean = false;
  loadError: boolean = false;
  constructor(
    private _productService: Productservice,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private Snackservice: Snackservice,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
     const adminValue = localStorage.getItem('isAdmin');
     this.isAdmin = adminValue === 'true';
  }

  loadProducts(loadMore: boolean = false) {
    if (this.loading) return; // avoid double calls
    this.loading = true;
    this.loadError = false;

    this._productService.getAllProducts(this.limit, this.skip).subscribe({
      next: (res: any) => {
        if (loadMore) {
          this.products = [...this.products, ...res.products];
        } else {
          this.products = res.products;
        }

        this.total = res.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this._productService.getCategories().subscribe((res: any) => {
      this.categories = res;
        this.cdr.detectChanges();
      
    });
  }

  filterByCategory() {
    if (this.selectedCategory) {
      this.isFiltering = true;
      this._productService.getProductsByCategory(this.selectedCategory).subscribe((res: any) => {
        this.products = res.products;
        this.cdr.detectChanges();

      });
    } else {
      this.isFiltering = false;
       this.resetPagination();
      this.loadProducts();
    }
  }

  search() {
    if (this.searchQuery.trim()) {
       this.isFiltering = true;
      this._productService.searchProducts(this.searchQuery).subscribe((res: any) => {
        this.products = res.products;
        this.cdr.detectChanges();

      });
    } else {
       this.isFiltering = false;
      this.selectedCategory = ''; 
       this.resetPagination();
      this.loadProducts();
    }
  }

  goToDetails(id: number) {
    this._productService.selectProduct(id);
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

  get displayedProducts(): Iproduct[] {
    const products = [...this.products];

    switch (this.sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  }

  getOriginalPrice(product: Iproduct): number {
    return product.price / (1 - product.discountPercentage / 100);
  }

 editProduct(product: Iproduct, event: Event) {
    event.stopPropagation(); // عشان ما يدخلش صفحة التفاصيل
    this.router.navigate(['/AddProduct'], {
      queryParams: { edit: true, id: product.id },
    });
  }

 //  Reset pagination when category/search changes
  resetPagination() {
    this.skip = 0;
    this.products = [];
  }

  // Detect scroll bottom to load more
  @HostListener('window:scroll', [])
  onScroll(): void {
     if (this.isFiltering) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    // When near the bottom (200px before end)
    if (scrollPosition >= pageHeight - 200 && !this.loading && this.products.length < this.total) {
      this.skip += this.limit;
      this.loadProducts(true);
    }
  }


}
