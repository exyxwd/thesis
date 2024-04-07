export enum TrashStatus {
    StillHere = 'STILLHERE',
    Cleaned = 'CLEANED',
    More = 'MORE'
}

export enum TrashCountry {
    Hungary = 'HUNGARY',
    Ukraine = 'UKRAINE',
    Romania = 'ROMANIA',
    Serbia = 'SERBIA',
    Slovakia = 'SLOVAKIA'
}

export enum TrashSize {
    Bag = 'BAG',
    Wheelbarrow = 'WHEELBARROW',
    Car = 'CAR'
}

export enum TrashType {
    Plastic = 'PLASTIC',
    Metal = 'METAL',
    Glass = 'GLASS',
    Domestic = 'DOMESTIC',
    Construction = 'CONSTRUCTION',
    Liquid = 'LIQUID',
    Dangerous = 'DANGEROUS',
    Automotive = 'AUTOMOTIVE',
    Electronic = 'ELECTRONIC',
    Organic = 'ORGANIC',
    DeadAnimals = 'DEADANIMALS'
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
    id: number;
    latitude: number;
    longitude: number;
    country: TrashCountry;
    locality: string;
    sublocality: string;
    size: TrashSize;
    status: TrashStatus;
    types: TrashType[];
    createTime: string;
    updateTime: string;
    updateNeeded: boolean;
    imageUrl: string;
    note: string;
    rivers: string[];
}