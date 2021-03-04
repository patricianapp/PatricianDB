import { IReleaseGroupList } from 'musicbrainz-api';

// export const testParams = {
//   artist: 'testArtist',
//   title: 'testTitle',
// };

export function mockReleaseGroup(artist: string, title: string): IReleaseGroupList {
  return {
    created: Intl.DateTimeFormat(),
    offset: 0,
    count: 1,
    'release-groups': [
      {
        id: 'mbidFromMusicBrainz',
        count: 1,
        score: 100,
        title: title,
        'primary-type': 'Album',
        'sort-name': title,
        'artist-credit': [
          {
            artist: {
              id: 'artistMbidFromMusicBrainz',
              name: artist,
              disambiguation: '',
              'sort-name': artist,
            },
          },
        ],
      },
    ],
  };
}
