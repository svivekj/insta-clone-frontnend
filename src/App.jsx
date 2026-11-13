import { useEffect, useState } from "react";
import { postApi } from './api/postApi';
import { Heart, PlusSquare, MessageCircle, Send } from "lucide-react";

function App() {
	const [feed, setFeed] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Form states for creating a post
	const [imageUrl, setImageUrl] = useState("");
	const [caption, setCaption] = useState("");
	const [submitting, setSubmitting] = useState(false);

	//Comment state
	const [commentInputs, setCommentInputs] = useState({});
	const [postComments, setPostComments] = useState({});
	const [expandedComments, setExpandedComments] = useState({});


	const currentUserId = 1; // Hardcoded current user (alex_dev)

	useEffect(() => {
		loadFeed();
	}, []);

	const loadFeed = async () => {
		try {
			const res = await postApi.getHomeFeed(currentUserId);
			setFeed(res.data.content || res.data);
			setLoading(false);
		} catch (err) {
			console.error('Backend connection error: ', err);
			setError('Could not connect to Spring Boot at http://localhost:9090, Make sure backend is running');
			setLoading(false);
		}
	}

	const handleLike = async (postId) => {
		try {
			await postApi.toggleLike(postId, currentUserId);

			loadFeed();
		} catch (err) {
			console.error('Error toggling like', err);
		}
	};

	const handlingCreatePost = async (e) => {
		e.preventDefault();
		if (!imageUrl.trim()) return alert("Please provide an image URL");

		setSubmitting(true);
		try {
			const postData = {
				caption: caption,
				imageUrl: imageUrl,
				authorId: currentUserId
			};

			await postApi.createPost(postData);

			setImageUrl("");
			setCaption("");
			loadFeed();
		} catch (err) {
			console.error('Error creating post: ', err);
			alert('Failed to create post. Check console for details.')
		} finally {
			setSubmitting(false);
		}
	};

	const toggleComments = async (postId) => {
		const isExpanded = expandedComments[postId];
		setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

		if (!isExpanded && !postComments[postId]) {
			try {
				const res = await postApi.getComments(postId);
				setPostComments(prev => ({ ...prev, [postId]: res.data }));
			} catch (err) {
				console.error("Error fetching comments: ", err);
			}
		}
	};

	const handleAddComment = async (postId, e) => {
		e.preventDefault();
		const text = commentInputs[postId];
		if (!text || !text.trim()) return;
		try {
			await postApi.addComment(postId, {
				text: text.trim(),
				userId: currentUserId
			});

			setCommentInputs(prev => ({ ...prev, [postId]: "" }));

			const res = await postApi.getComments(postId);
			setPostComments(prev => ({ ...prev, [postId]: res.data }));

			loadFeed();
		} catch (err) {
			console.error("Error adding comment: ", err);
			alert("Failed to add comment");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-gray-900 tracking-tight">Instagram Clone</h1>
				<p className="text-sm text-gray-500">React + Vite + Tailwind v4 ➔ Spring Boot 3 + PostgreSQL</p>
			</header>


			<main className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

				{/* Create Post Form Card */}
				<div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
					<div className="flex items-center space-x-2 mb-4 border-b pb-2 text-gray-800 font-semibold text-lg">
						<PlusSquare className="w-5 h-5 text-blue-500" />
						<h2>Create New Post</h2>
					</div>

					<form onSubmit={handlingCreatePost} className="space-y-3">
						<div>
							<input
								type="text"
								placeholder="Image URL (e.g., Unsplash link)"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								className="w-full text-sm border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 bg-gray-50"
								required
							/>
						</div>
						<div>
							<textarea
								placeholder="Write a caption..."
								value={caption}
								onChange={(e) => setCaption(e.target.value)}
								className="w-full text-sm border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 bg-gray-50 resize-none h-20"
							/>
						</div>
						<button
							type="submit"
							disabled={submitting}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2 rounded transition-colors disabled:opacity-50 cursor-pointer"
						>
							{submitting ? 'Sharing...' : 'Share Post'}
						</button>
					</form>
				</div>

				{/* Live Feed Test Card */}
				<h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">Live Feed Test</h2>

				{loading && (
					<p className="text-sm text-gray-500 text-center py-4">Connecting to Spring Boot backend...</p>
				)}

				{error && (
					<div className="bg-red-50 text-red-600 text-sm p-3 rounded border border-red-200 text-center">
						{error}
					</div>
				)}

				{!loading && !error && feed.length === 0 && (
					<p className="text-sm text-gray-400 text-center py-4">
						Backend connected successfully! No posts found in feed yet.
					</p>
				)}

				{!loading && feed.map((post) => (
					<div key={post.id} className="mb-6 border-b border-gray-100 pb-4">
						{/* Author Header */}
						<div className="flex items-center mb-2">
							<span className="font-semibold text-sm text-gray-900">{post.author.username}</span>
						</div>
						{/* Post Image */}
						<img src={post.imageUrl} alt="Post" className="w-full h-72 object-cover rounded mb-2" />
						{/* Action Bar (Like button*/}
						<div className="flex item-center space-x-3 mb-2">
							<button onClick={() => handleLike(post.id)}
								className="focus:outline-none transition-transform active:scale-125 cursor-pointer"
								aria-label="Like post"
							>
								<Heart className="w-6 h-6 text-red-500 hover:text-red-600 fill-current" />
							</button>
						</div>
						<p className="text-sm text-gray-800">
							<span className="font-semibold mr-1">{post.author.username}:</span>
							{post.caption}
						</p>
						<div className="text-xs text-gray-400 mt-2">
							{post.likesCount} likes • {post.commentsCount} comments
						</div>
						{/* Comments Toggle Link */}
						<button onClick={() => toggleComments(post.id)}
							className="text-xs text-gray-400 mt-2 hover:underline cursor-pointer block">
							{expandedComments[post.id] ? 'Hide comments' : `View all ${post.commentsCount} comments`}
						</button>
						{/* Expanded Comments Section */}
						{expandedComments[post.id] && (
							<div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
								{postComments[post.id]?.length === 0 ? (
									<p className="text-xs text-gray-400">No comments yet. Be the first!</p>
								) : (
									postComments[post.id]?.map((comment) => (
										<div key={comment.id} className="text-xs text-gray-700">
											<span className="font-semibold mr-1">{comment.author?.username || 'user'}</span>
											{comment.text}
										</div>
									))
								)}
							</div>
						)}

						{/* Add comment Input */}
						<form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center mt-2 space-x-2">
							<input
								type="text"
								placeholder="Add a comment..."
								value={commentInputs[post.id] || ""}
								onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
								className="w-full text-xs border border-gray-300 rounded p-1.5 focus:outline-none focus:border-blue-500 bg-gray-50"
								required
							/>
							<button
								type="submit"
								className="text-blue-500 hover:text-blue-600 p-1 cursor-pointer"
								aria-label="Send comment"
							>
								<Send className="w-4 h-4" />
							</button>
						</form>
					</div>
				))}
			</main>
		</div>
	)
}

export default App;