

export default function NoImage() {
    return(
        <div style={{"fontSize": "18pt"}}>
            <div className="my-4">
                <span>
                    The Project Gutenberg E-Book you tried to access does not exist in our alt text database.
                </span>
            </div>
            <div className="mb-4">
                <span>
                    This is either because it has not been added, contains no images, or the item number inputted was incorrect.
                </span>
            </div>
            <div>
                <span>
                    Please keep browsing or search for a new one.
                </span>
            </div>
        </div>
       

    );
}