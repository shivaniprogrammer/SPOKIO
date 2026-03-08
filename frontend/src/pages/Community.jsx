import React, { useState } from 'react';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      user: "SPOKIO_ADMIN", 
      img: "https://tse3.mm.bing.net/th/id/OIP.BXYbbn0IgAucv82dsHgtzwHaEo?rs=1&pid=ImgDetMain&o=7&rm=3", 
      likes: 666, 
      caption: "Check out these mountain views from the archive.",
      comments: [
        { id: 101, user: "Alex", text: "This looks amazing!" },
        { id: 102, user: "Jordan", text: "I want to go there." }
      ]
    },
    { 
      id: 2, 
      user: "NEON_GHOST", 
      img: "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70", 
      likes: 102, 
      caption: "Found this beautiful spot today.",
      comments: [
        { id: 201, user: "Sarah", text: "So pretty!" },
        { id: 202, user: "Mike", text: "Nice shot." }
      ]
    },
    { 
      id: 3, 
      user: "CYBER_EXPLORER", 
      img: "https://www.pixelstalk.net/wp-content/uploads/2016/08/Best-Nature-Full-HD-Images-For-Desktop.jpg", 
      likes: 88, 
      caption: "The waterfall is so peaceful.",
      comments: [
        { id: 301, user: "Chris", text: "Wow, so clear!" }
      ]
    },
    { 
      id: 4, 
      user: "VIOLET_REBEL", 
      img: "https://www.wallpics.net/wp-content/uploads/2017/07/amazing-nature-wallpaper-10047797.jpg", 
      likes: 45, 
      caption: "Sunset in the mountains.",
      comments: [
        { id: 401, user: "Admin", text: "Great photo!" },
        { id: 402, user: "Taylor", text: "Love the colors." }
      ]
    }
  ]);

  const [likedPosts, setLikedPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);

  const handleLike = (id) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts([...likedPosts, id]);
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const toggleComments = (id) => {
    setVisibleComments(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="community-page-container">
      <div className="community-content">
        {/* Main Title - Unique class to prevent red color leak */}
        <h1 className="community-main-title">COMMUNITY </h1>
        
        <div className="feed-container">
          {posts.map(post => (
            <div key={post.id} className="insta-card">
              <div className="card-header">
                <span className="user-dot"></span> @{post.user}
              </div>
              
              <div className="img-container">
                 <img src={post.img} alt="post" className="post-img" />
              </div>

              <div className="card-footer">
                <div className="interaction-row">
                  <button 
                    className={`action-btn like-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`} 
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="icon">💜</span> {post.likes}
                  </button>
                  
                  <button 
                    className="action-btn comment-btn" 
                    onClick={() => toggleComments(post.id)}
                  >
                    <span className="icon">💬</span> {post.comments.length}
                  </button>
                </div>

                <p className="caption"><strong>{post.user}</strong> {post.caption}</p>

                <div className="view-comments-text" onClick={() => toggleComments(post.id)}>
                  {visibleComments.includes(post.id) ? "Hide comments" : `View all ${post.comments.length} comments`}
                </div>

                {visibleComments.includes(post.id) && (
                  <div className="comments-list">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="comment-line">
                        <span className="comment-author">@{comment.user}</span> {comment.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;