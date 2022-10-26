import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NestService } from './nest.service';

@Module({
  imports: [HttpModule],
  providers: [NestService],
  exports: [NestService],
  })
export class NestModule {}
