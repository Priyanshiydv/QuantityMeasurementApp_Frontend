import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  SocialAuthService
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1013858391313-89l8lfcc0rtbqmef4b16afiseh0o9gde.apps.googleusercontent.com',
              {
                oneTapEnabled: false
              }
            )
          }
        ],
        onError: (err: any) => {
           console.error('SocialAuth error:', err);
        }
      } as SocialAuthServiceConfig
    },
    SocialAuthService
  ]
};