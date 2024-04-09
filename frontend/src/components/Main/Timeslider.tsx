import React, { useState } from 'react';
import { calcRange } from 'models/functions';
import { useSetSelectedTime } from './FilterContext';

/**
 * Time slider and date input to filter too old data from the map
 *
 * @returns {React.ReactElement} The time slider and date input
 */
const Timeslider = (): React.ReactElement => {
    const [st, setSt] = useState(new Date(calcRange().def));
    const setSelectedTime = useSetSelectedTime();

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = new Date(Number(e.target.value));
        setSt(newTime);
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newTime = new Date(Number((e.target as HTMLInputElement).value));
        setSelectedTime(newTime);
        setSt(newTime);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const newTime = new Date(e.target.value);
            setSt(newTime);
            setSelectedTime(newTime);
        } else {
            // Handle the case when the user clears or sets the calendar to "today"
            setSt(new Date());
            setSelectedTime(new Date());
        }
    };

    return (
        <div className='container'>
            <div className='row filter-row'>
                {/* <div>{st.toDateString()}</div> */}
                <input
                    type='range'
                    id='time-slider'
                    min={calcRange().min}
                    max={calcRange().max}
                    value={st.getTime()}
                    step={86400000}
                    onChange={(e) => handleTimeChange(e)}
                    onInput={(e) => handleInput(e)}
                />
                <input
                    type='date'
                    id='date-input'
                    min={new Date(calcRange().min).toISOString().split('T')[0]}
                    max={new Date(calcRange().max).toISOString().split('T')[0]}
                    value={st.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e)}
                    onKeyDown={(e) => e.preventDefault()}
                />
            </div>
        </div>
    );
};

export default Timeslider;