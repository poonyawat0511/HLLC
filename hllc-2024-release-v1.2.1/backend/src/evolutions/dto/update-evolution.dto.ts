import { IsIn } from 'class-validator';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';

export class UpdateEvolutionDto {
  @NotAllowed()
  user: string;

  @NotAllowed()
  item: string;

  @NotAllowed()
  timestamp: string;

  @IsIn([true], { message: `Field 'isUsed' can be true only` })
  isUsed: boolean;
}
