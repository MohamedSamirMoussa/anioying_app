import { BlockEnum } from "../libs/redux/features/dashboardSlice";

export enum RoleEnum {
  admin='admin',
  super='super',
  user='user'
}

export interface IConfirmInterface {
  email: string;
  otp: string;
}
export interface IResetPass {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
export interface IFormValues {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
  gender?: string;
}
export interface IUser {
  id: string;
  username: string;
  email: string;
  gender?: string;
  role: RoleEnum;
  isBlocked: BlockEnum;
  [key: string]: any;
}

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: any;
  isLogged: boolean;
  discordUrl: string | null;
  token: string;
}

export interface IPageContent {
  sectionData: Record<string, any>;
  loading: boolean;
  error: string | null;
}
