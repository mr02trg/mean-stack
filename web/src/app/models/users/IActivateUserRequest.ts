import { ITokenRequest } from '../common/ITokenRequest';

export interface IActivateUserRequest extends ITokenRequest {
    password: string;
}