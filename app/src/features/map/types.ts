export type MarkersResponse = {
    markers: MarkerResponse[];
    city?: string;
    country?: string;
};

export type MarkerResponse = {
    lat: number;
    lng: number;
    name: string;
};
