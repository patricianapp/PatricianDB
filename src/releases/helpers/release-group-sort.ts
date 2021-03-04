// TODO: sort by tracklist similarity
// TODO: sort by popularity (Spotify?)
import { IArtist, IReleaseGroup } from 'musicbrainz-api';
import { compareTwoStrings } from 'string-similarity';

const MAX_RELEASE_COUNT = 20;

function findYearSimilarity(year1: number, year2: number): number {
  // 5 years = 0
  // 0 years = 1
  const difference = Math.abs(year1 - year2);
  const squashedDifference = Math.max(difference, 5);
  const reversed = 5 - squashedDifference;
  return reversed / 5;
}

// TODO: Make PR to musicbrainz-api: IArtistCredit fields 'name' and 'joinphrase' should be optional
// using array of artist credits because we are calculating this at the release group level
function findHighestArtistCreditSimilarity(artistInput: string, artistCredits: Array<{ artist: IArtist }>) {
  let highestNumber = 0;

  for (const artistCredit of artistCredits) {
    const aliases = [
      artistCredit.artist.name,
      artistCredit.artist['sort-name'],
      ...(artistCredit.artist.aliases ?? []).flatMap(a => [a.name, a['sort-name']]),
    ];

    for (const alias of aliases) {
      const similarity = Math.max(
        compareTwoStrings(artistInput, alias),
        compareTwoStrings('The' + artistInput, alias),
        compareTwoStrings(artistInput, 'The' + alias),
      );
      if (similarity > highestNumber) {
        highestNumber = similarity;
      }
      if (highestNumber === 1) {
        return highestNumber;
      }
    }
  }
  return highestNumber;
}

function findHighestReleaseTitleSimilarity(titleInput: string, releaseGroup: IReleaseGroup) {
  let highestNumber = 0;

  const mainTitleSimilarity = Math.max(
    compareTwoStrings(titleInput, releaseGroup.title),
    compareTwoStrings('The' + titleInput, releaseGroup.title),
    compareTwoStrings(titleInput, 'The' + releaseGroup.title),
  );
  highestNumber = mainTitleSimilarity;
  if (highestNumber === 1) {
    return highestNumber;
  }

  for (const release of releaseGroup.releases) {
    const similarity = compareTwoStrings(titleInput, release.title);
    if (similarity > highestNumber) {
      highestNumber = similarity;
    }
    if (highestNumber === 1) {
      return highestNumber;
    }
  }
  return highestNumber;
}

function preferAlbumType(releaseGroup: IReleaseGroup) {
  // Single
  if (releaseGroup['primary-type'] !== 'Album') {
    return 0;
  }

  // Album + Compilation, Album + Live
  if (releaseGroup['secondary-types']) {
    return 0.5;
  }

  // Album
  return 1;
}

function releaseCountconfidence(releaseGroup: IReleaseGroup, highestCount: number) {
  return Math.min(MAX_RELEASE_COUNT, releaseGroup.count) / highestCount;
}

// Enables us to measure the "count" field on a 0 to 1 scale.
// Usage: releaseGroup.count / highestCount = (value from 0 to 1)
function findHighestCount(releaseGroupResults: Array<IReleaseGroup>) {
  return Math.min(MAX_RELEASE_COUNT, Math.max(...releaseGroupResults.map(r => r.count)));
}

interface ReleaseGroupSortFields {
  releaseGroupResults: Array<IReleaseGroup>;
  titleInput: string;
  artistInput: string;
  yearInput?: number;
}

export type SortedResults = Array<{ confidence: number; searchResult: IReleaseGroup }>;

export function getSortedReleaseGroupResults(fields: ReleaseGroupSortFields): SortedResults {
  const { releaseGroupResults, titleInput, artistInput } = fields;
  const highestCount = findHighestCount(releaseGroupResults);

  const sortedResults: SortedResults = releaseGroupResults.map(searchResult => {
    const confidenceAddends: Array<{ name: string; value: number }> = [];

    confidenceAddends.push({
      name: 'artistSimilarity',
      value: findHighestArtistCreditSimilarity(artistInput, searchResult['artist-credit']),
    });
    confidenceAddends.push({
      name: 'titleSimilarity',
      value: findHighestReleaseTitleSimilarity(titleInput, searchResult),
    });
    confidenceAddends.push({
      name: 'releaseCountconfidence',
      value: releaseCountconfidence(searchResult, highestCount),
    });
    confidenceAddends.push({
      name: 'albumType',
      value: preferAlbumType(searchResult),
    });

    const confidence = confidenceAddends.map(a => a.value).reduce((a, b) => a + b) / confidenceAddends.length;
    return {
      confidence,
      confidenceAddends,
      searchResult,
    };
  });
  return sortedResults.sort((a, b) => b.confidence - a.confidence);
}
