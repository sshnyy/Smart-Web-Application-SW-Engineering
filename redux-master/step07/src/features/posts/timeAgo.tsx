import { parseISO, formatDistanceToNow } from 'date-fns';
import React from 'react';

const TimeAgo = (props: { timestamp: string }) => {
    let timeAgo = '';

    if (props.timestamp) {
        const date = parseISO(props.timestamp);
        const timePeriod = formatDistanceToNow(date);

        timeAgo = `${timePeriod} ago`;
    }

    return (
        <span title={props.timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    );
};

export default TimeAgo;