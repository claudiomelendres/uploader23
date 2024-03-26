import { BadRequestException, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';

@Controller('file')
export class UploadController {

    constructor(private readonly uploadService: UploadService) { }

    @Get('/:fileName')
    async findProductImage(
        @Res() res: Response, // esto salta interceptores
        @Param('fileName') filename: string,
    ) {
        const path = await this.uploadService.getFile(filename);
        console.log(path);
        res.send(path); // el res es de response de express y nos devuelve la imagen como tal
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFilter,
        limits: { fileSize: 1000000 },


    }))
    async UploadedFile(@UploadedFile(
        // new ParseFilePipe({
        //     validators: [
        //         // new MaxFileSizeValidator({ maxSize: 1000000 }),
        //         // new FileTypeValidator({ fileType: 'image/jpeg, image/png' })
        //     ]
        // })
    ) file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Make sure that the file is an image');
        console.log(file);
        await this.uploadService.upload(file.originalname, file.buffer);
        return {
            status: HttpStatus.OK,
            message: 'File uploaded successfully',
        };
    }

}
