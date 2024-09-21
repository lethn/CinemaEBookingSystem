import React from 'react';
import MoviesCard from './MoviesCard';

const MoviesCardList = (props) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 p-6 mx-5 mt-1">
            {props.movies.map((movie) => (
                <MoviesCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    category={movie.category}
                    cast={movie.cast}
                    director={movie.director}
                    producer={movie.producer}
                    synopsis={movie.synopsis}
                    trailer={movie.trailer}
                    picture={movie.picture}
                    rating={movie.rating}
                    nowPlaying={movie.nowPlaying}
                />
            ))}
        </div>
    );
};

export default MoviesCardList;
