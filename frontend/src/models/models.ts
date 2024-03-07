export enum TrashStatus {
    StillHere = 'StillHere',
    Cleaned = 'Cleaned',
    More = 'More'
}

export enum TrashCountry {
    Hungary = 'Hungary',
    Ukraine = 'Ukraine',
    Romania = 'Romania',
    Serbia = 'Serbia',
    Slovakia = 'Slovakia'
}

export enum TrashSize {
    Bag = 'Bag',
    Wheelbarrow = 'Wheelbarrow',
    Car = 'Car'
}

export enum TrashType {
    Plastic = 'Plastic',
    Metal = 'Metal',
    Glass = 'Glass',
    Domestic = 'Domestic',
    Construction = 'Construction',
    Liquid = 'Liquid',
    Dangerous = 'Dangerous',
    Automotive = 'Automotive',
    Electronic = 'Electronic',
    Organic = 'Organic',
    DeadAnimals = 'DeadAnimals'
}

export interface MinimalTrashData{
    id: number;
    latitude: number;
    longitude: number;
    country: TrashCountry;
    size: TrashSize;
    status: TrashStatus;
    types: TrashType[];
    rivers: string[];
    updateTime: string;
}

export interface ExpandedTrashData
{
    latitude: number;
    longitude: number;
    accessibilities: string[];
    country: TrashCountry;
    locality: string;
    sublocality: string;
    size: TrashSize;
    status: TrashStatus;
    types: TrashType[];
    createTime: string;
    updateTime: string;
    updateNeeded: boolean;
    images: string[];
    note: string;
    rivers: string[];
}