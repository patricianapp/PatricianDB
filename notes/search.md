# Create search index

[Docs](https://oss.redislabs.com/redisearch/Commands/#ftcreate)

```
 FT.CREATE {index}
    [ON {structure}]
       [PREFIX {count} {prefix} [{prefix} ..]
       [FILTER {filter}]
       [LANGUAGE {default_lang}]
       [LANGUAGE_FIELD {lang_field}]
       [SCORE {default_score}]
       [SCORE_FIELD {score_field}]
       [PAYLOAD_FIELD {payload_field}]
    [MAXTEXTFIELDS] [TEMPORARY {seconds}] [NOOFFSETS] [NOHL] [NOFIELDS] [NOFREQS] [SKIPINITIALSCAN]
    [STOPWORDS {num} {stopword} ...]
    SCHEMA {field} [TEXT [NOSTEM] [WEIGHT {weight}] [PHONETIC {matcher}] | NUMERIC | GEO | TAG [SEPARATOR {sep}] ] [SORTABLE][NOINDEX] ...
```

```
FT.CREATE idx:movie ON hash PREFIX 1 "movie:" SCHEMA title TEXT SORTABLE release_year NUMERIC SORTABLE rating NUMERIC SORTABLE genre TAG SORTABLE
```

```
FT.CREATE idx:release-groups ON hash PREFIX 1 "release-group:" SCHEMA title TEXT artist TEXT disambiguation TEXT
```

# Search by query

```
FT.SEARCH {index} {query} [NOCONTENT] [VERBATIM] [NOSTOPWORDS] [WITHSCORES] [WITHPAYLOADS] [WITHSORTKEYS]
  [FILTER {numeric_field} {min} {max}] ...
  [GEOFILTER {geo_field} {lon} {lat} {radius} m|km|mi|ft]
  [INKEYS {num} {key} ... ]
  [INFIELDS {num} {field} ... ]
  [RETURN {num} {field} ... ]
  [SUMMARIZE [FIELDS {num} {field} ... ] [FRAGS {num}] [LEN {fragsize}] [SEPARATOR {separator}]]
  [HIGHLIGHT [FIELDS {num} {field} ... ] [TAGS {open} {close}]]
  [SLOP {slop}] [INORDER]
  [LANGUAGE {language}]
  [EXPANDER {expander}]
  [SCORER {scorer}] [EXPLAINSCORE]
  [PAYLOAD {payload}]
  [SORTBY {field} [ASC|DESC]]
  [LIMIT offset num]
```

# Search by artist/title

```
FT.SEARCH cars "@country:korea @engine:(diesel|hybrid) @class:suv"
```
