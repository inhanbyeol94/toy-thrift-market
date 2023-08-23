import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Pick, Product } from 'src/_common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMiddleware } from 'src/_common/middlewares/upload.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Pick])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: '/products', method: RequestMethod.POST });
    // consumer.apply(TokenValidMiddleware).forRoutes(BoardsController);
  }
}
