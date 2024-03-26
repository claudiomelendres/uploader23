import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class UploadService {

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    })

    constructor(
        private readonly configService: ConfigService
    ) { }

    async upload(fileName: string, file: Buffer) {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
                Key: fileName,
                Body: file,
            })
        );
    }

    async getFile(fileName: string) {
        const getObjectCommand = new GetObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
            Key: fileName,
        });
        try {
            const response = await this.s3Client.send(getObjectCommand);
            const stream = response.Body as Readable;
            const chunks: Uint8Array[] = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
        } catch (error) {
            // Manejo de errores
            console.error('Error al descargar el archivo desde S3:', error);
            throw error;
        }
    }
}
