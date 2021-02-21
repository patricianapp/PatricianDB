// if artist similarity is less than 1,
// always check the aliases and find the highest similarity amount

[
  {
    highestArtistCreditSimilarity: 1,
    highestReleaseTitleSimilarity: 0.5,
    yearSimilarity: 0, // 5+ years apart
    comment: `same artist, probably a different album`
  },
  {
    highestArtistCreditSimilarity: 0.5,
    highestReleaseTitleSimilarity: 0.5,
    yearSimilarity: 0, // 5+ years apart
    comment: `very unlikely.
      could be a misspelled artist, metadata-suffixed title, and anniversary edition`
  },
  {
    highestArtistCreditSimilarity: 0.5,
    highestReleaseTitleSimilarity: 0.5,
    yearSimilarity: 0, // 5+ years apart
    comment: `very unlikely.
      could be a misspelled artist, metadata-suffixed title, and anniversary edition`
  },
]

// other comparisons: type, tracklist, popularity
