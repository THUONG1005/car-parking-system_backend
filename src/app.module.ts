import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CardModule } from './modules/card/card.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ParkingModule } from './modules/parking/parking.module';
import { SlotModule } from './modules/slot/slot.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { PriceModule } from './modules/price/price.module';
import { DatabaseModule } from './database/database.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { RequestLoggerMiddleware } from './common/middlewares';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CloudinaryModule,
    UserModule,
    CardModule,
    TransactionModule,
    PaymentModule,
    ParkingModule,
    SlotModule,
    AuthModule,
    PriceModule,
    AppModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    
  }
}
