import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Schema()
export class RelationShip {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;
}

export type RelationshipDoc = RelationShip & Document;

export const RelationShipSchema = SchemaFactory.createForClass(RelationShip);

// Custom validation middleware to check sender and receiver equality
RelationShipSchema.pre<RelationshipDoc>('validate', async function (next) {
  // Ensure `sender` and `receiver` are `Types.ObjectId`
  if (this.sender instanceof Types.ObjectId && this.receiver instanceof Types.ObjectId) {
    if (this.sender.equals(this.receiver)) {
      return next(new Error('Sender and receiver cannot be the same person.'));
    }
  }
  
  // Check for the reverse relationship
  const existingRelation = await this.model('RelationShip').findOne({
    sender: this.receiver,
    receiver: this.sender,
  });

  if (existingRelation) {
    return next(new Error('The reverse relationship already exists.'));
  }

  next();
});

RelationShipSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
RelationShipSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
