import Link from "next/link";
import MovieListing from "./movieListing";

export default function ComingSoon() {

    return (
        <div>
            <h1 class="font-bold m-2 text-4xl text-center">
                ComingSoon
            </h1>
            <div class="bg-slate-100 rounded-xl text-black text-center grid grid-cols-5 mx-10">
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            <MovieListing/>
            </div>
        </div>
    );
}