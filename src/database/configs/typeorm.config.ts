import { User } from '../../modules/user/user.entity';
import { Token } from '../../modules/auth/token.entity';
import { Card } from '../../modules/card/card.entity';
import { Slot } from '../../modules/slot/slot.entity';
import { Parking } from '../../modules/parking/parking.entity';
import { Payment } from '../../modules/payment/payment.entity';
import { Transaction } from '../../modules/transaction/transaction.entity';
import { Price } from '../../modules/price/price.entity';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();

const dbConfigObject = () => {
  const configService = new ConfigService();
  const environment = String(configService.get('ENV'));

  if (environment === 'dev') {
    return {
      host: String(configService.get('DB_HOST_DEV')),
      port: Number(configService.get('DB_PORT_DEV')),
      username: String(configService.get('DB_USERNAME_DEV')),
      password: String(configService.get('DB_PASSWORD_DEV')),
      database: String(configService.get('DB_NAME_DEV')),
      logging: Boolean(configService.get('DB_LOGGING_DEV') === 'true'),
    };
  } else if (environment === 'local') {
    return {
      host: String(configService.get('DB_HOST_LOCAL')),
      port: Number(configService.get('DB_PORT_LOCAL')),
      username: String(configService.get('DB_USERNAME_LOCAL')),
      password: String(configService.get('DB_PASSWORD_LOCAL')),
      database: String(configService.get('DB_NAME_LOCAL')),
      logging: Boolean(configService.get('DB_LOGGING_LOCAL') === 'true'),
    };
  } else {
    throw new Error('Lỗi  -_-!!');
  }
};

export const dbConfig = {
  type: 'postgres',
  ...dbConfigObject(),
  entities: [User, Token, Card, Slot, Parking, Payment, Transaction, Price],
  synchronize: false,
  autoLoadEntities: false, // Nếu dùng entities: ['../../modules/**/*.entity.ts'] thì để là true */
  retryAttempts: 10,
  retryDelay: 3000,
};
