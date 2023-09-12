import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/oauth2/redirect/google', // 이 부분은 구글 콘솔에서 설정한대로. 승인된 리디렉션 URI
      scope: ['email', 'profile'],
    });
  }

  //   validate(accessToken, refreshToken, profile: any) {
  //     return {
  //       email: profile.emails[0].value,
  //     };
  //   }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { name, emails, photos, provider } = profile;
      const user = {
        email: emails[0].value,
        firstName: name.familyName,
        lastName: name.givenName,
        photo: photos[0].value,
        provider,
      };
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 user:', user);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
