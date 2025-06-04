import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './shared/security/login/login.component';
import { RegisterComponent } from './shared/security/register/register.component';
import { ForgotPasswordComponent } from './shared/security/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/security/reset-password/reset-password.component';
import { authGuard } from './shared/security/guard/auth.guard';
import { userProfileRoutes } from './user-profile/user.routes';
import { categoryRoutes } from './features/category/category.routes';
import {settingRoutes} from './features/setting/setting.routes';
import {accountRoutes} from './features/account/account.routes';
import {accountUserRoutes} from './features/accountUser/accountUser.routes';
import {chatRoutes} from './features/chat/chat.routes';
import {transactionRoutes} from './features/transaction/transaction.routes';
import {fileManagerRoutes} from './features/fileManager/fileManager.routes';

export const routes: Routes = [
  ...categoryRoutes,
  ...userProfileRoutes,
  ...settingRoutes,
  ...accountRoutes,
  ...accountUserRoutes,
  ...chatRoutes,
  ...transactionRoutes,
  ...fileManagerRoutes,

  { path: '', component: HomeComponent },
  { path: 'security/login', component: LoginComponent },
  { path: 'security/register', component: RegisterComponent },
  { path: 'security/forgot-password', component: ForgotPasswordComponent },
  { path: 'security/reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '' }
];
