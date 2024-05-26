// TODO: docs
export enum WasteStatus {
    StillHere = 'STILLHERE',
    Cleaned = 'CLEANED',
    More = 'MORE'
}

export enum WasteCountry {
    Hungary = 'HUNGARY',
    Ukraine = 'UKRAINE',
    Romania = 'ROMANIA',
    Serbia = 'SERBIA',
    Slovakia = 'SLOVAKIA'
}

export enum WasteSize {
    Bag = 'BAG',
    Wheelbarrow = 'WHEELBARROW',
    Car = 'CAR'
}

export enum WasteType {
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

export interface MinimalWasteData {
    id: number;
    latitude: number;
    longitude: number;
    country: WasteCountry;
    size: WasteSize;
    status: WasteStatus;
    types: WasteType[];
    river: string;
    updateTime: string;
    hidden: boolean;
}

export interface ExpandedWasteData {
    id: number;
    latitude: number;
    longitude: number;
    country: WasteCountry;
    locality: string;
    sublocality: string;
    river: string;
    size: WasteSize;
    status: WasteStatus;
    types: WasteType[];
    createTime: string;
    updateTime: string;
    updateNeeded: boolean;
    note: string;
    imageUrl: string;
    hidden: boolean;
}

export interface RegisterData {
    username: string;
    password: string;
}

export type UserDataType = {
    username: string;
}

export interface UpdateLog {
    id: number;
    updateTime: string;
    updateCount: number;
    deleteCount: number;
    totalCount: number;
}

export enum NotificationType {
    Error = 'ERROR',
    Success = 'SUCCESS',
    Info = 'INFO'
}

export interface River {
    name: string;
    tributaries: string[];
    rank: number;
}

export const filterRivers: River[] = [
    {
        name: 'DUNA',
        tributaries: ['RÁBCA', 'TISZA', 'SIÓ', 'BENTA', 'RÁBA', 'LAJTA', 'DRÁVA', 'KARASICA', 'GORTVA', 'IPOLY'],
        rank: 1
    },
    {
        name: 'TISZA',
        tributaries: ['MAROS', 'BORZA', 'KRASZNA', 'TÚR', 'SZAMOS', 'BODROG', 'HEJŐ', 'SAJÓ', 'ZAGYVA', 'HÁRMAS-KÖRÖS'],
        rank: 2
    },
    {
        name: 'SIÓ',
        tributaries: ['KAPOS'],
        rank: 2
    },
    {
        name: 'DRÁVA',
        tributaries: ['RINYA', 'MURA'],
        rank: 2
    },
    {
        name: 'RÁBA',
        tributaries: ['GYÖNGYÖS', 'MARCAL', 'PINKA', 'LAPINCS'],
        rank: 2
    },
    {
        name: 'MAROS',
        tributaries: [],
        rank: 3
    },
    {
        name: 'SAJÓ',
        tributaries: ['BÓDVA', 'HERNÁD'],
        rank: 3
    },
    {
        name: 'BÓDVA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'BORZA',
        tributaries: [],
        rank: 3
    },
    {
        name: 'TÁPIÓ',
        tributaries: [],
        rank: 4
    },
    {
        name: 'ZAGYVA',
        tributaries: ['TÁPIÓ', 'SZUHA', 'TARNA', 'GALGA'],
        rank: 3
    },
    {
        name: 'SZUHA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'RÁBCA',
        tributaries: ['RÉPCE'],
        rank: 2
    },
    {
        name: 'BENTA',
        tributaries: [],
        rank: 2
    },
    {
        name: 'HÁRMAS-KÖRÖS',
        tributaries: ['KETTŐS-KÖRÖS', 'SEBES-KÖRÖS', 'HORTOBÁGY'],
        rank: 3
    },
    {
        name: 'KETTŐS-KÖRÖS',
        tributaries: ['FEHÉR-KÖRÖS', 'FEKETE-KÖRÖS'],
        rank: 4
    },
    {
        name: 'SEBES-KÖRÖS',
        tributaries: ['BERETTYÓ'],
        rank: 4
    },
    {
        name: 'FEHÉR-KÖRÖS',
        tributaries: [],
        rank: 5
    },
    {
        name: 'FEKETE-KÖRÖS',
        tributaries: [],
        rank: 5
    },
    {
        name: 'HORTOBÁGY',
        tributaries: [],
        rank: 4
    },
    {
        name: 'LAJTA',
        tributaries: [],
        rank: 2
    },
    {
        name: 'KRASZNA',
        tributaries: [],
        rank: 3
    },
    {
        name: 'BERETTYÓ',
        tributaries: [],
        rank: 5
    },
    {
        name: 'TÚR',
        tributaries: [],
        rank: 3
    },
    {
        name: 'SZAMOS',
        tributaries: [],
        rank: 3
    },
    {
        name: 'BODROG',
        tributaries: ['ONDAVA', 'LATORCA'],
        rank: 3
    },
    {
        name: 'RÉPCE',
        tributaries: [],
        rank: 3
    },
    {
        name: 'ZALA',
        tributaries: [],
        rank: 1
    },
    {
        name: 'MARCAL',
        tributaries: [],
        rank: 3
    },
    {
        name: 'RINYA',
        tributaries: [],
        rank: 3
    },
    {
        name: 'KARASICA',
        tributaries: [],
        rank: 2
    },
    {
        name: 'KAPOS',
        tributaries: [],
        rank: 3
    },
    {
        name: 'PINKA',
        tributaries: ['STRÉM'],
        rank: 3
    },
    {
        name: 'STRÉM',
        tributaries: [],
        rank: 4
    },
    {
        name: 'KERKA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'MURA',
        tributaries: ['KERKA', 'LENDVA'],
        rank: 3
    },
    {
        name: 'LAPINCS',
        tributaries: [],
        rank: 3
    },
    {
        name: 'LENDVA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'GORTVA',
        tributaries: [],
        rank: 2
    },
    {
        name: 'IPOLY',
        tributaries: [],
        rank: 2
    },
    {
        name: 'HEJŐ',
        tributaries: [],
        rank: 3
    },
    {
        name: 'GALGA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'TARNA',
        tributaries: [],
        rank: 4
    },
    {
        name: 'HERNÁD',
        tributaries: [],
        rank: 4
    },
    {
        name: 'ONDAVA',
        tributaries: ['TAPOLY'],
        rank: 4
    },
    {
        name: 'LATORCA',
        tributaries: ['LABORC'],
        rank: 4
    },
    {
        name: 'LABORC',
        tributaries: ['UNG'],
        rank: 5
    },
    {
        name: 'UNG',
        tributaries: [],
        rank: 6
    },
    {
        name: 'TAPOLY',
        tributaries: [],
        rank: 5
    }
]