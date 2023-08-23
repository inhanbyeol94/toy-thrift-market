import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/_common/typeorm.config';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ViewModule,
    MemberModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
