import Link from "next/link";

export default function MovieListing() {

    return(
        <div class="m-5">
            <div>
                <img src="https://placehold.co/500x750" alt="placeholder"/>
                <div class="font-bold mt-2">
                    Title : Rating
                </div>
                <div class="mb-2">
                    Directed by ...
                </div>
                
                <Link href="/viewMovie" className="m-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
                    Get Tickets
                </Link>
            </div>
        </div>
    )
}