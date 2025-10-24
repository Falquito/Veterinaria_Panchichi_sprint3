import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './categorias/categorias.module';
import { DepositosModule } from './depositos/depositos.module';
import { OrdenDeCompraModule } from './orden-de-compra/orden-de-compra.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { CompraModule } from './compra/compra.module';
import { FacturasModule } from './facturas/facturas.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { MovimientosModule } from './movimientos/movimientos/movimientos.module';
import { OrdenDePagoModule } from './orden-de-pago/orden-de-pago.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [ProductosModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
        //configuro typeORM con un objeto de la ocnfiguracion de la conexion
        TypeOrmModule.forRoot({
          type: 'postgres', 
          url:process.env.DB_URL,
          ssl:
          {
            rejectUnauthorized:false
          },
          autoLoadEntities:true,//carga automaticamente las entidades
          synchronize:true, //los cambios en las tablas se sincronizan
          entities:[
            __dirname + '/**/*.entity{.ts,.js}'
          ]
        }),
        CategoriasModule,
        
        DepositosModule,
        
        OrdenDeCompraModule,
        ProveedoresModule,
        
        CompraModule,
        FacturasModule,
        ComprobanteModule,
        MovimientosModule,
        OrdenDePagoModule,
        VentasModule
        
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
