import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clientes } from 'src/entities/Cliente.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Clientes)
    private readonly clienteRepository:Repository<Clientes>
  ){}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = this.clienteRepository.create(createClienteDto)

    return await this.clienteRepository.save(cliente)
  }

  async findAll() {
    return await this.clienteRepository.find()
  }

  async findOne(id: number) {
    return await this.clienteRepository.findOneBy({id:id})
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }

  async login(loginDto:LoginDto){
    const {email,password} = loginDto
    const cliente = await this.clienteRepository.findOneBy({email:email})

    if(!cliente) throw new NotFoundException(`Cliente con el correo: ${email} no encontrado.`)

    if (cliente.contraseña===password) return cliente;
  } 
}
