import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecordsDocument = HydratedDocument<Records>;

@Schema()
export class Records {
  @Prop()
  name: string;
  @Prop()
  score: string;
}
export const RecordsSchema = SchemaFactory.createForClass(Records);