import { Routes } from '@angular/router';
import { Home } from './componants/home/home';
import { About } from './componants/about/about';
import { Login } from './componants/login/login';
import { Register } from './componants/register/register';
import { AddProduct } from './componants/add-product/add-product';
import { authGardGuard } from './services/auth-gard-guard';
import { ProductDetails } from './componants/product-details/product-details';
import { Cart } from './componants/cart/cart';
import { PayedComponant } from './componants/payed-componant/payed-componant';
import { Wishlist } from './componants/wishlist/wishlist';

export const routes: Routes = [
    { path: '', redirectTo: '/Login', pathMatch: 'full' },
    {path:'Home',component:Home},
    {path:'About',component:About},
    {path:'Cart',component:Cart},
    {path:'Wishlist',component:Wishlist},
    {path:'productDetails',component:ProductDetails},
    {path:'Payed',component:PayedComponant},
    {path:'AddProduct',canActivate: [authGardGuard],component:AddProduct},
    {path:'Login',component:Login},
    {path:'Register',component:Register},

];
