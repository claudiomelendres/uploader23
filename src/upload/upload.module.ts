import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService): ThrottlerModuleOptions => [{
                ttl: Number(configService.getOrThrow('UPLOAD_RATE_TTL')) || 60000,
                limit: Number(configService.getOrThrow('UPLOAD_RATE_LIMIT')) || 3,
            }],
            inject: [ConfigService]
        }),
        // ThrottlerModule.forRoot([{
        //     ttl: 60000,
        //     limit: 3,
        // }]),
    ],
    controllers: [UploadController],
    providers: [
        UploadService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        }
    ],
})
export class UploadModule { }
