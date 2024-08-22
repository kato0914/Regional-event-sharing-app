'use client';
import { Map as DefaultMap, latLngEquals, useMarkerRef, useApiIsLoaded, useMapsLibrary, isLatLngLiteral, toLatLngLiteral, useApiLoadingStatus, useAdvancedMarkerRef, limitTiltRange, Pin, Marker, useMap, InfoWindow, MapControl, APIProvider, AdvancedMarker, ControlPosition, APILoadingStatus, GoogleMapsContext, APIProviderContext, AdvancedMarkerContext, } from '@vis.gl/react-google-maps';
import { useState, useCallback } from 'react';
const Map = ({ children, ...rest }) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const [_zoom, setZoom] = useState(rest.zoom);
    const [_center, setCenter] = useState(rest.center);
    /* eslint-enable @typescript-eslint/naming-convention */
    const zoom = _zoom ?? rest.zoom;
    const center = _center ?? rest.center;
    const handleZoomChanged = useCallback((event) => {
        rest.onZoomChanged?.(event);
        setZoom(event.detail.zoom);
    }, [rest]);
    const handleCenterChanged = useCallback((event) => {
        rest.onCenterChanged?.(event);
        setCenter(event.detail.center);
    }, [rest]);
    return (<DefaultMap {...rest} {...(zoom
        ? {
            zoom,
            onZoomChanged: handleZoomChanged,
        }
        : {})} {...(center
        ? {
            center,
            onCenterChanged: handleCenterChanged,
        }
        : {})} mapId={rest.mapId ?? 'map'} // shit breaks if we don't set mapId
    >
      {children}
    </DefaultMap>);
};
export { Map, latLngEquals, useMarkerRef, useApiIsLoaded, useMapsLibrary, isLatLngLiteral, toLatLngLiteral, useApiLoadingStatus, useAdvancedMarkerRef, limitTiltRange, Pin, Marker, useMap, InfoWindow, MapControl, APIProvider, AdvancedMarker, ControlPosition, APILoadingStatus, GoogleMapsContext, APIProviderContext, AdvancedMarkerContext, };
