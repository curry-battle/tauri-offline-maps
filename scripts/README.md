# Scripts

Scripts used for the tilemaking process

## geofabrik

Basically, we need scripts to organize the different downloadable regions, and also to find the urls for us to download. This doesn't include region naming/localization, so maybe need to figure that out later.

The files we need are:

1. `[insert-region]-latest.osm.pbf`: map data
2. `[insert-region].poly`: the borders of each region

## tilemaker

We want tilemaker to create tiles that are compatible with our protomaps styles. Basically, you just need these files in the directory when you need to process your pbf:

```
tilemaker monaco-latest.osm.pbf monaco.pmtiles
```

We need a config/script combination for generating:

1. A worldmap of coastlines
2. Detailed downloadable maps
