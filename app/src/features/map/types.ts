export type MarkersResponse = {
    markers: MarkerResponse[];
};

export type MarkerResponse = {
    lat: number;
    lng: number;
    name: string;
};
