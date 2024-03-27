import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSetting } from './setting.schema';

@Schema({ timestamps: true })
export class SocialMedia {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSetting' })
  settings?: UserSetting;
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);

export type SocialMediaDocument = SocialMedia & Document;
