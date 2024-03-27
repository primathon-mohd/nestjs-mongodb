import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserSetting {
  @Prop({ required: false })
  receiveNotifications?: boolean;

  @Prop({ required: false })
  receiveEmail?: boolean;

  @Prop({ required: false })
  receiveSMS?: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(UserSetting);
export type SettingDocument = Document & UserSetting;
