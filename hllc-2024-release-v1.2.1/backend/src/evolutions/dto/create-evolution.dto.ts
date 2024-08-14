import { IsMongoId } from 'class-validator';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';

export class CreateEvolutionDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  item: string;

  @NotAllowed()
  timestamp: string;

  @NotAllowed()
  isUsed: boolean;
}
