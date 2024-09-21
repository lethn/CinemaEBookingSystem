import React from 'react';
import MoviesCardList from './moviesCardList';

const ComingSoon = (props) => {
    return (
        <div>
            <MoviesCardList movies={props.movies} />
        </div>
    );
};

export default ComingSoon;
