import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsResponse,Iproduct } from '../interfaces/iproduct';
import { Categories } from '../interfaces/categories';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class Productservice {
  private apiUrl = 'https://dummyjson.com/products';
  readonly selectedProductId = signal<number | null>(null);
  private readonly wishlistStorageKey = 'store-wishlist';
  private wishlistProducts: Iproduct[] = this.loadWishlist();
  private wishlistCountSubject = new BehaviorSubject<number>(this.wishlistProducts.length);
  readonly wishlistCount$ = this.wishlistCountSubject.asObservable();
  cardProducts:Iproduct[]=[];
  ///Payed links
  public stripeTiers = [
    { max: 50, url: 'https://buy.stripe.com/test_00weV5793acD2oOh1V87K00' },
    { max: 150, url: 'https://buy.stripe.com/test_cNi14f3WRdoPbZodPJ87K01' },
    { max: null, url: 'https://buy.stripe.com/test_fZu7sDfFz70r8NcdPJ87K02' }
  ];

  constructor(private http: HttpClient, private translate: TranslateService) {}

  selectProduct(productId: number): void {
    this.selectedProductId.set(productId);
  }

  getAllProducts(limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
  return this.http.get<ProductsResponse>(`${this.apiUrl}?limit=${limit}&skip=${skip}`);
}

  getProductsByCategory(category: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/category/${category}`);
  }

  searchProducts(query: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/search?q=${query}`);
  }

  getProductById(id: number): Observable<Iproduct> {
    return this.http.get<Iproduct>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Categories> {
    return this.http.get<Categories>(`${this.apiUrl}/categories`);
  }
   addProduct(productData: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/add`, productData);
  }
  ////////////////////////////////////////////// CART LOGIC ////////////////////////////////////////////////////
  getCartProducts() {
    return this.cardProducts;
  }

  isInCart(productId: number): boolean {
    return this.cardProducts.some(product => product.id === productId);
  }

  addToCart(product: Iproduct): string {
    const exist = this.cardProducts.find(p => p.id === product.id);
    if (exist) {
      return this.translate.instant('CART.MSG_ALREADY_EXISTS');
    } else {
      this.cardProducts.push({ ...product, quantity: 1 });
      return this.translate.instant('CART.MSG_ADDED_SUCCESS');
    }
  }

updateQuantity(productId: number, change: number) {
  const item = this.cardProducts.find(p => p.id === productId);
  if (item && typeof item.quantity === 'number') {
    let newQty = item.quantity + change;

    if (newQty < 1) {
      newQty = 1;
    }

    item.quantity = newQty;
  }
}

  removeFromCart(productId: number) {
    this.cardProducts = this.cardProducts.filter(p => p.id !== productId);
  }

  getCartTotal() {
    return this.cardProducts.reduce((acc, p) => acc + (p.price * (p.quantity ?? 1)), 0);
  }

  clearCart() {
    this.cardProducts = [];
  }

  ///////////////////////////////////////////// WISHLIST LOGIC /////////////////////////////////////////////////
  getWishlistProducts(): Iproduct[] {
    return [...this.wishlistProducts];
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistProducts.some(product => product.id === productId);
  }

  toggleWishlist(product: Iproduct): boolean {
    const existingIndex = this.wishlistProducts.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      this.wishlistProducts.splice(existingIndex, 1);
    } else {
      this.wishlistProducts.unshift(product);
    }

    this.persistWishlist();
    return existingIndex < 0;
  }

  removeFromWishlist(productId: number): void {
    this.wishlistProducts = this.wishlistProducts.filter(product => product.id !== productId);
    this.persistWishlist();
  }

  private loadWishlist(): Iproduct[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedWishlist = localStorage.getItem(this.wishlistStorageKey);
      return storedWishlist ? JSON.parse(storedWishlist) as Iproduct[] : [];
    } catch {
      return [];
    }
  }

  private persistWishlist(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.wishlistStorageKey, JSON.stringify(this.wishlistProducts));
    }
    this.wishlistCountSubject.next(this.wishlistProducts.length);
  }
}
