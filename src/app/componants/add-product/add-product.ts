import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl, ReactiveFormsModule } from '@angular/forms';
import { Productservice } from '../../services/productservice';
import { Categories } from '../../interfaces/categories';
import { Snackservice } from '../../services/snackservice';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule,TranslateModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {
  productForm: FormGroup;
  categories: Categories[] = [];
  isEditMode: boolean = false;
  editingProductId: number | null = null;


  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      if (params['edit'] === 'true' && params['id']) {
        this.isEditMode = true;
        this.editingProductId = +params['id'];
        this.loadProductData(this.editingProductId);
      }
    });
  }

  constructor(private _productService: Productservice,private fb: FormBuilder,
    private cdr: ChangeDetectorRef,private Snackservice: Snackservice, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', null]
    });
  }

    loadCategories() {
    this._productService.getCategories().subscribe((res: any) => {
      this.categories = res;
        this.cdr.detectChanges();
      
    });
  }
 loadProductData(id: number) {
    this._productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.thumbnail || product.images?.[0] || ''
        });
      },
      error: () => {
        this.Snackservice.show('Error loading product data!', 'error');
      }
    });
  }

  //  إرسال البيانات
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      const productData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        images: [formData.imageUrl]
      };

      if (this.isEditMode && this.editingProductId) {
        //  تحديث المنتج
        this._productService.addProduct(productData).subscribe({
          next: () => {
            this.Snackservice.show('Product updated successfully!', 'success');

            //  بعد التعديل: نرجع للوضع العادي
            this.productForm.reset();
            this.isEditMode = false;
            this.editingProductId = null;
            this.cdr.detectChanges();
          },
          error: () => {
            this.Snackservice.show('Error updating product!', 'error');
          }
        });
      } else {
        // إضافة منتج جديد
        this._productService.addProduct(productData).subscribe({
          next: () => {
            this.Snackservice.show('Product added successfully!', 'success');
            this.productForm.reset();
          },
          error: (err) => {
            this.Snackservice.show(`Error adding product! ${err}`, 'error');
          }
        });
      }
    } else {
      this.Snackservice.show('Please fill all required fields correctly!', 'error');
    }
  }

}
