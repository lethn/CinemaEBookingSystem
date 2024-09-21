import React from 'react';
import MoviesCardList from './moviesCardList';

const NowPlaying = (props) => {
    return (
        <div>
            <MoviesCardList movies={props.movies} />
        </div>
    );
};

export default NowPlaying;
