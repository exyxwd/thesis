/**
 * Enumeration representing the status of a waste
 * 
 * @readonly
 * @enum {string}
 * @property {string} StillHere - Waste is still present
 * @property {string} Cleaned - Waste has been cleaned
 * @property {string} More - More waste since last update
 */
export enum WasteStatus {
    StillHere = 'STILLHERE',
    Cleaned = 'CLEANED',
    More = 'MORE'
}

/**
 * Enumeration representing the country of a waste
 *
 * @readonly
 * @enum {string}
 * @property {string} Hungary - Hungary
 * @property {string} Ukraine - Ukraine
 * @property {string} Romania - Romania
 * @property {string} Serbia - Serbia
 * @property {string} Slovakia - Slovakia
 */
export enum WasteCountry {
    Hungary = 'HUNGARY',
    Ukraine = 'UKRAINE',
    Romania = 'ROMANIA',
    Serbia = 'SERBIA',
    Slovakia = 'SLOVAKIA'
}

/**
 * Enumeration representing the size of a waste
 *
 * @readonly
 * @enum {string}
 * @property {string} Bag - Waste fits into a bag
 * @property {string} Wheelbarrow - Waste fits into a wheelbarrow
 * @property {string} Car - Vehicle is needed
 */
export enum WasteSize {
    Bag = 'BAG',
    Wheelbarrow = 'WHEELBARROW',
    Car = 'CAR'
}

/**
 * Enumeration representing the type of a waste
 *
 * @readonly
 * @enum {string}
 * @property {string} Plastic - Plastic
 * @property {string} Metal - Metal
 * @property {string} Glass - Glass
 * @property {string} Domestic - Domestic
 * @property {string} Construction - Construction
 * @property {string} Liquid - Liquid
 * @property {string} Dangerous - Dangerous
 * @property {string} Automotive - Automotive
 * @property {string} Electronic - Electronic
 * @property {string} Organic - Organic
 * @property {string} DeadAnimals - Animal remains
 */
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
/**
 * Interface representing the reduced data of a waste
 *
 * @interface
 * @property {number} id - id of the waste
 * @property {number} latitude - latitude of the waste
 * @property {number} longitude - longitude of the waste
 * @property {string} country - country the waste is in
 * @property {TrashSize} size - size of the waste
 * @property {TrashStatus} status - status of the waste
 * @property {TrashType[]} types - types of the waste
 * @property {string} river - river near the waste
 * @property {string} updateTime - time of the last update
 * @property {boolean} hidden - whether the waste is hidden or not
 */

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

/**
 * Interface representing the more detailed data of a waste
 *
 * @interface
 * @property {number} id - id of the waste
 * @property {number} latitude - latitude of the waste
 * @property {number} longitude - longitude of the waste
 * @property {string} country - country the waste is in
 * @property {string} locality - more specific locality of the waste
 * @property {string} sublocality - even more specific locality of the waste
 * @property {TrashSize} size - size of the waste
 * @property {TrashStatus} status - status of the waste
 * @property {TrashType[]} types - types of the waste
 * @property {string} createTime - the initial time of the report's creation
 * @property {string} updateTime - the time of the report's last update
 * @property {string} note - note recorded for the waste
 * @property {string} imageUrl - URL of the image of the waste
 * @property {string} river - river near the waste
 * @property {boolean} hidden - whether the waste is hidden or not
 */
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
    note: string;
    imageUrl: string;
    hidden: boolean;
}

/**
 * Interface representing the register data submitted by the user
 *
 * @interface
 * @property {string} username - username of the user
 * @property {string} password - password of the user
 */
export interface RegisterData {
    username: string;
    password: string;
}

/**
 * Interface representing the data of the user
 *
 * @interface
 * @property {string} username - username of the user
 */
export type UserDataType = {
    username: string;
}

/**
 * Interface representing the database update logs
 * 
 * @interface
 * @property {number} id - id of the log
 * @property {string} updateTime - time of the update
 * @property {number} updateCount - number of updated wastes
 * @property {number} deleteCount - number of deleted wastes
 * @property {number} totalCount - total number of wastes after the update
 */
export interface UpdateLog {
    id: number;
    updateTime: string;
    updateCount: number;
    deleteCount: number;
    totalCount: number;
}

/**
 * Enumeration representing the type of a notification
 *
 * @enum {string}
 * @property {string} Error - Error notification
 * @property {string} Success - Success notification
 * @property {string} Info - Information notification
 */
export enum NotificationType {
    Error = 'ERROR',
    Success = 'SUCCESS',
    Info = 'INFO'
}

/**
 * Interface representing a river and its data
 *
 * @interface
 * @property {string} name - name of the river
 * @property {string[]} tributaries - names of the tributaries of the river
 * @property {number} rank - rank of the river, rank 1 means its a main river,
 * rank 2 that it is a tributary of a main river, etc.
 */
export interface River {
    name: string;
    tributaries: string[];
    rank: number;
}

/**
 * Data of the rivers that are selectable. Includes the names, tributeris and ranks of the rivers.
 */
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