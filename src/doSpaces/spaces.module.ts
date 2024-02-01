import { Module } from '@nestjs/common';
import { DoSpacesServiceProvider } from '@/doSpaces/doSpaces.provider';
import { DoSpacesService } from '@/doSpaces/doSpace.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DoSpacesServiceProvider, DoSpacesService],
  exports: [DoSpacesServiceProvider, DoSpacesService],
})
export class SpacesModule {}
