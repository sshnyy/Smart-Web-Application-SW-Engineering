import React from 'react';

const Spinner = (props: { text: string }) => {
    const header = props.text ? <h4>{props.text}</h4> : null;
    const size = '5em';

    return (
        <div className="spinner">
            {header}
            <div className="loader" style={{ height: size, width: size }} />
        </div>
    );
};

export default Spinner;