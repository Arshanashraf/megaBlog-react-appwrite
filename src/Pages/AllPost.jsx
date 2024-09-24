import React, { useState, useEffect } from 'react';
import { Container, PostCard } from "../components"; // Ensure these are correctly imported
import appwriteService from "../appwrite/config";

function AllPost() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await appwriteService.getPosts([]);
                if (response) {
                    setPosts(response.documents); // Set the posts
                } else {
                    setError("No posts found."); // Handle empty response
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to fetch posts."); // Set error message
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchPosts(); // Call the fetch function
    }, []); // Empty dependency array ensures this runs once on mount

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div className="text-red-500">{error}</div>; // Error message
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} /> {/* Spread operator to pass post props */}
                            </div>
                        ))
                    ) : (
                        <p>No posts available.</p> // Message if no posts found
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPost;
