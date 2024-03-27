import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class RegisteredUser {
  @Prop({ isRequired: true })
  username: string;

  @Prop({ isRequired: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(RegisteredUser);
export type UserDocument = RegisteredUser & Document;
