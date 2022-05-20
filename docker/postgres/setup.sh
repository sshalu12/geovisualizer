#!/usr/bin/env bash

psql -U postgres -d geovisualizer -c "CREATE OR REPLACE LANGUAGE plpythonu;"
psql -U postgres -d geovisualizer -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d geovisualizer -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -U postgres -d geovisualizer < /opt/sql/geovisualizer.drop.sql
psql -U postgres -d geovisualizer < /opt/sql/geovisualizer.sql
psql -U postgres -d geovisualizer < /opt/sql/geovisualizer.extra.sql
psql -U postgres -d geovisualizer < /opt/sql/geovisualizer_data.sql
