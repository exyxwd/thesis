// import { Role } from './models';

/**
 * Calculates the range of the slider (minimum and maximum) and the default value
 * 
 * @returns {{min: number, max: number, def: number}} The minimum, the maximum and the default value of the slider
 */
export function calcRange(): { min: number, max: number, def: number } {
    const maxDate = new Date();
    const minDate = new Date();

    minDate.setFullYear(maxDate.getFullYear() - 1);

    const max = maxDate.getTime();
    const min = minDate.getTime();

    const def = min; // (max*2+min)/3

    return { min, max, def };
}

/**
 * Assigns a number value to each role depending on the role's level
 *
 * @type {Object.<Role, number>}
 * @property {number} Superadmin - 30
 * @property {number} Admin - 20
 * @property {number} User - 10
 */
// export const RoleValue: { [key in Role]: number } = {
//     [Role.Superadmin]: 30,
//     [Role.Admin]: 20,
//     [Role.User]: 10,
// };