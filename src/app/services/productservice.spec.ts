import { HttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Iproduct } from '../interfaces/iproduct';
import { Productservice } from './productservice';

describe('Productservice wishlist', () => {
  let service: Productservice;

  const product = {
    id: 42,
    title: 'Saved product',
    price: 20
  } as Iproduct;

  beforeEach(() => {
    localStorage.removeItem('store-wishlist');

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        Productservice,
        { provide: HttpClient, useValue: {} },
        { provide: TranslateService, useValue: { instant: (key: string) => key } }
      ]
    });

    service = TestBed.inject(Productservice);
  });

  afterEach(() => {
    localStorage.removeItem('store-wishlist');
  });

  it('should add a product and persist it', () => {
    const added = service.toggleWishlist(product);

    expect(added).toBeTrue();
    expect(service.isWishlisted(product.id)).toBeTrue();
    expect(service.getWishlistProducts()).toEqual([product]);
    expect(JSON.parse(localStorage.getItem('store-wishlist') ?? '[]')).toEqual([product]);
  });

  it('should remove an existing product', () => {
    service.toggleWishlist(product);
    const added = service.toggleWishlist(product);

    expect(added).toBeFalse();
    expect(service.isWishlisted(product.id)).toBeFalse();
    expect(service.getWishlistProducts()).toEqual([]);
  });

  it('should emit the current wishlist count', () => {
    const counts: number[] = [];
    const subscription = service.wishlistCount$.subscribe(count => counts.push(count));

    service.toggleWishlist(product);
    service.removeFromWishlist(product.id);

    expect(counts).toEqual([0, 1, 0]);
    subscription.unsubscribe();
  });
});
