import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecordsDocument = HydratedDocument<Records>;

@Schema()
export class Records {
  @Prop({ required:true,unique:true})
  name: string;
  @Prop({default:0})
  score: number;
}
export const RecordsSchema = SchemaFactory.createForClass(Records);