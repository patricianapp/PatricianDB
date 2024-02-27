import { DefaultContext } from '@envelop/types';

export interface Context extends DefaultContext {
  spotifyToken?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    createDate: Date;
  };
}
