import { IsMongoId } from "class-validator";

export class CreateRelationshipDto {
  @IsMongoId()
  sender: string;

  @IsMongoId()
  receiver: string;
}
