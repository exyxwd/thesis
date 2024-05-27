import React, { useState } from 'react';

import { calcRange } from 'models/functions';
import { useSetSelectedTime } from './FilterContext';

/**
 * Time slider and date input to filter too old data from the map
 *
 * @returns {React.ReactElement} The time slider and date input
 */
const TimeSlider = (): React.ReactElement => {
    const [st, setSt] = useState(new Date(calcRange().def));
    const setSelectedTime = useSetSelectedTime();

    // While sliding the time slider, update the selected time
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = new Date(Number(e.target.value));
        setSt(newTime);
    };

    // When the user releases the time slider, set the selected time
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newTime = new Date(Number((e.target as HTMLInputElement).value));
        setSelectedTime(newTime);
        setSt(newTime);
    };

    // When the user changes the date input, update the selected time
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const newTime = new Date(e.target.value);
            setSelectedTime(newTime);
            setSt(newTime);
        } else {
            // Handle the case when the user clears or sets the calendar to "today"
            setSelectedTime(new Date());
            setSt(new Date());
        }
    };

    return (
        <div className='container'>
            <div className='row filter-row'>
                <input
                    type='range'
                    id='time-slider'
                    min={calcRange().min}
                    max={calcRange().max}
                    value={st.getTime()}
                    onChange={(e) => handleTimeChange(e)}
                    onMouseUp={(e) => handleInput(e)}
                    onTouchEnd={(e) => handleInput(e)}
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

export default TimeSlider;