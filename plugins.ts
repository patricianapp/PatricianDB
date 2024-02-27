import { MeshPlugin } from '@graphql-mesh/types';
import axios from 'axios';
import { type Plugin } from '@envelop/core';
import { Context } from './context';

const clientCredentialsString = Buffer.from(
  process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
).toString('base64');

async function getToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: 'Basic ' + clientCredentialsString,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
}

const useClientCredentials: Plugin = {
  async onContextBuilding({
    context,
    extendContext,
  }: {
    context: Context;
    extendContext: any;
  }) {
    console.log('Context building started!');

    if (
      !context.spotifyToken ||
      context.spotifyToken.createDate.getTime() +
        context.spotifyToken.expires_in * 1000 <
        Date.now()
    ) {
      console.log('Fetching new token');
      const token = await getToken();
      extendContext({
        spotifyToken: {
          ...token,
          createDate: new Date(),
        },
      });
    }

    console.log('Context building done!', { context });
  },
};

const plugins: MeshPlugin<any>[] = [useClientCredentials];

export default plugins;
