import Link from "next/link";
import MovieListing from "./movieListing";

export default function NowPlaying() {
    // We could maybe do the API calls here instead of on the homepage

    return (
        <div>
            <h1 className="font-bold m-2 text-4xl text-center">
                Now Playing
            </h1>
            <div className="bg-slate-100 rounded-xl text-black text-center grid grid-cols-5 mx-10">
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            </div>
        </div>
    );
}