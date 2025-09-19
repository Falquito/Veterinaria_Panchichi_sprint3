import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto,DepositoStockDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import cloudinary from 'src/providers/cloudinary/cloudinary.provider';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productos', // carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  } as any,
});
// Pipe para multipart + arrays + nested DTOs
export class MultipartValidationPipe implements PipeTransform {
  constructor(private readonly dtoClass: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    // Parsear depositos si viene como string
    if (value.depositos && typeof value.depositos === 'string') {
      try {
        value.depositos = JSON.parse(value.depositos);
      } catch {
        throw new BadRequestException('depositos must be a valid JSON array');
      }
    }

    // Convertir números
    if (value.precio) value.precio = Number(value.precio);
    if (value.categoriaId) value.categoriaId = Number(value.categoriaId);

    // Transformar cada objeto del array a su clase
    if (Array.isArray(value.depositos)) {
      value.depositos = value.depositos.map(d => plainToInstance(DepositoStockDto, d));
    }

    // Transformar todo a instancia del DTO principal
    const dtoObject = plainToInstance(this.dtoClass, value);

    // Validar DTO
    const errors = validateSync(dtoObject, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      throw new BadRequestException(messages);
    }

    return dtoObject;
  }
}

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen',{storage}))
  create(
    @Body(new MultipartValidationPipe(CreateProductoDto)) createProductoDto: CreateProductoDto,
    @UploadedFile() file:Express.Multer.File
  ) { 
      console.log(createProductoDto)

    return this.productosService.create(createProductoDto,file);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.productosService.restore(+id);
  }
}
