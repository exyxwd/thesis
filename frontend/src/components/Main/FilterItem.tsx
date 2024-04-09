import React from 'react';
import { Trans } from 'react-i18next';

interface Props {
    content: string;
    selected: boolean;
    count: number | undefined;
    OnSelect: (content: string) => void;
}

/**
 * Sets up the individial waste filter items
 *
 * @param {Props} param0 content: content of the filter item,
 * OnSelect: function to handle the selection of the filter item,
 * selected: whether the filter item is selected or not
 * @returns {React.ReactElement} Waste filter item
 */
const FilterItem = ({ content, selected, count, OnSelect }: Props): React.ReactElement => {
    return (
        <>
            {count ?
                <div className={selected ? 'filter-item selected' : 'filter-item'} onClick={() => OnSelect(content)}>
                    <Trans i18nKey={`filters.${content.toLowerCase()}`}>
                        {content.toLowerCase().charAt(0).toUpperCase() + content.toLowerCase().slice(1)}
                    </Trans>
                    {selected ? <></> : <div className='filter-item-count'>{count}</div>}
                </div>
                :
                <div className='filter-item no-points'>
                    <Trans i18nKey={`filters.${content.toLowerCase()}`}>
                        {content.toLowerCase().charAt(0).toUpperCase() + content.toLowerCase().slice(1)}
                    </Trans>
                </div>}
        </>
    )
}

export default FilterItem;