import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Pick, Product } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMiddleware } from 'src/_common/middlewares/upload.middleware';
import { ProductImageModule } from 'src/product-image/product-image.module';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Pick]), ProductImageModule],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: '/products', method: RequestMethod.POST });
    consumer.apply(TokenValidMiddleware).forRoutes(ProductController);
  }
}
