import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { AdminProductController } from './admin-product.controller';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/_common/entities';
import { ProductImageModule } from 'src/product-image/product-image.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProductImageModule],
  controllers: [AdminProductController],
  providers: [AdminProductService, JwtService],
})
export class AdminProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(AdminProductController);
  }
}
