import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_REGION'),
    })

    constructor(
        private readonly configService: ConfigService
    ) {}
}