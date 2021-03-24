# Diagram

## Synchronous

Only make calls to Spotify if we are retrieving info on genre, moods, etc. and using that to tag items

Perhaps we'll want to store mood data in our db so we can aggregate it. Just need to double check that that doesn't break terms of service

My thought is that we can work around this by making it an optional customizable import rather than a 1-to-1 copy. For example, when adding a group of albums, you can specify if you want certain moods to correspond with certain tags in your collection. Then, you can browse albums in other collections by tag. The tags can be derived from Spotify but will not match Spotify.

```mermaid
sequenceDiagram
    participant UI as Patrician UI
    participant API as Patrician API
    participant Auth as Auth Service
    participant CDB as Collection Database
    participant PDB as PatricianDB
    participant Redis as Redis
    participant Solr as MB Solr
    participant Spotify as Spotify
    UI->>API: Add Album
    API->>Auth: Is this user authorized?
    Auth->>API: Yes
    API->>CDB: Does this album exist in collection (match artist, title)?
    CDB->>API: No
    API->>PDB: Retrieve MBID and metadata for this album
    PDB->>Redis: Is this artist/title query cached?
    Redis->>PDB: No
    PDB->>Solr: Retrieve MB result
    Solr->>PDB: MBID, metadata, URLs
    PDB->>Spotify: Spotify search (if necessary)
    Spotify->>PDB: Spotify result
    PDB->>Redis: Cache combined result
    Redis->>PDB: Success
    PDB->>API: MBID, metadata
    API->>CDB: Add album with MBID and metadata
    CDB->>API: Album successfully added
    API->>UI: Album successfully added
```

<!-- ## Asynchronous

```mermaid
sequenceDiagram
    participant UI as Patrician UI
    participant API as Patrician API
    participant Auth as Auth Service
    participant CDB as Collection Database
    participant PDB as PatricianDB
    participant Redis as Redis, MB, Spotify
    UI->>API: Add Album
    API->>Auth: Is this user authorized?
    Auth->>API: Yes
    API->>CDB: Does this album exist in collection (match artist, title)?
    CDB->>API: No. Album has now been added
    API->>UI: Album added
    API->>PDB: Retrieve PatricianDB ID and metadata for this album
    PDB->>Redis: Album lookup
    Redis->>PDB: Album metadata
    PDB->>API: ID, metadata
    API->>CDB: Update album with PatricianDB ID and metadata
    CDB->>API: Album successfully updated
    API->>UI: Album updated with new metadata
``` -->

# Should we have an API gateway act as auth server before hitting Patrician API?

- Pro: makes the API code simpler, integrates with Cognito
- Con: Not sure if this works with GraphQL

# Other notes

- Patrician API should hit database directly, becuase there's no reason not to
