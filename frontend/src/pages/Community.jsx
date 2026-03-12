import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Community.css';

const API_BASE = 'https://spokio.onrender.com';

const Community = () => {
  const [posts, setPosts]               = useState([]);
  const [likedPosts, setLikedPosts]     = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentUser, setCommentUser]   = useState('');
  const [loading, setLoading]           = useState(true);

  // Upload form state
  const [uploadUser, setUploadUser]     = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFile, setUploadFile]     = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(function() {
    fetchPosts();
  }, []);

  var fetchPosts = async function() {
    try {
      setLoading(true);
      var res = await axios.get(API_BASE + '/api/community/posts');
      setPosts(res.data);
    } catch(err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  var handleFileChange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    var reader = new FileReader();
    reader.onloadend = function() { setUploadPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  var handleUpload = async function(e) {
    e.preventDefault();
    if (!uploadFile) { alert('Please select an image!'); return; }
    if (!uploadUser.trim()) { alert('Please enter your username!'); return; }
    setUploading(true);
    try {
      var formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('user', uploadUser.toUpperCase());
      formData.append('caption', uploadCaption);
      var res = await axios.post(API_BASE + '/api/community/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts(function(prev) { return [res.data, ...prev]; });
      setUploadUser('');
      setUploadCaption('');
      setUploadFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowUploadModal(false);
    } catch(err) {
      alert('Upload failed: ' + (err.response ? err.response.data.error : err.message));
    } finally {
      setUploading(false);
    }
  };

  var handleLike = async function(id) {
    var isLiked = likedPosts.includes(id);
    try {
      var res = await axios.post(API_BASE + '/api/community/posts/' + id + '/like', {
        action: isLiked ? 'unlike' : 'like'
      });
      if (isLiked) {
        setLikedPosts(likedPosts.filter(function(pid) { return pid !== id; }));
      } else {
        setLikedPosts([...likedPosts, id]);
      }
      setPosts(posts.map(function(p) { return p._id === id ? res.data : p; }));
    } catch(err) {
      console.error('Like failed:', err);
    }
  };

  var toggleComments = function(id) {
    setVisibleComments(function(prev) {
      return prev.includes(id)
        ? prev.filter(function(cId) { return cId !== id; })
        : [...prev, id];
    });
  };

  var handleComment = async function(id) {
    var text = commentInputs[id];
    if (!text || !text.trim()) { alert('Type a comment first!'); return; }
    try {
      var res = await axios.post(API_BASE + '/api/community/posts/' + id + '/comment', {
        user: commentUser || 'ANONYMOUS',
        text: text
      });
      setPosts(posts.map(function(p) { return p._id === id ? res.data : p; }));
      setCommentInputs(function(prev) { return {...prev, [id]: ''}; });
    } catch(err) {
      console.error('Comment failed:', err);
    }
  };

  return (
    <div className="community-page-container">
      <div className="neon-particles"></div>

      <div className="community-content">
        <h1 className="community-main-title" data-text="COMMUNITY">COMMUNITY</h1>

        {/* ── Username for comments ── */}
        <input
          className="neon-input-small comment-name-input"
          type="text"
          placeholder="YOUR NAME FOR COMMENTS..."
          value={commentUser}
          onChange={function(e) { setCommentUser(e.target.value); }}
        />

        {/* ── Feed ── */}
        <div className="feed-container">
          {loading && (
            <p className="feed-status">LOADING POSTS...</p>
          )}
          {!loading && posts.length === 0 && (
            <p className="feed-status">NO POSTS YET — BE THE FIRST TO POST!</p>
          )}
          {posts.map(function(post) {
            return (
              <div key={post._id} className="insta-card">
                <div className="card-header">
                  <span className="user-dot"></span> @{post.user}
                </div>

                <div className="img-container">
                  <img src={API_BASE + post.imgUrl} alt="post" className="post-img" />
                </div>

                <div className="card-footer">
                  <div className="interaction-row">
                    {/* Like button */}
                    <button
                      className={"action-btn like-btn " + (likedPosts.includes(post._id) ? 'liked' : '')}
                      onClick={function() { handleLike(post._id); }}
                    >
                      <span className="icon">💜</span> {post.likes}
                    </button>

                    {/* Comment button — styled like like button */}
                    <button
                      className={"action-btn comment-btn " + (visibleComments.includes(post._id) ? 'active' : '')}
                      onClick={function() { toggleComments(post._id); }}
                    >
                      <span className="icon">✦</span> {post.comments.length}
                    </button>
                  </div>

                  <p className="caption"><strong>@{post.user}</strong> {post.caption}</p>

                  <div className="view-comments-text" onClick={function() { toggleComments(post._id); }}>
                    {visibleComments.includes(post._id)
                      ? 'Hide comments'
                      : 'View all ' + post.comments.length + ' comments'}
                  </div>

                  {visibleComments.includes(post._id) && (
                    <div className="comments-list">
                      {post.comments.map(function(comment, idx) {
                        return (
                          <div key={idx} className="comment-line">
                            <span className="comment-author">@{comment.user}</span> {comment.text}
                          </div>
                        );
                      })}
                      <div className="comment-input-row">
                        <input
                          className="neon-input-small comment-input"
                          type="text"
                          placeholder="ADD A COMMENT..."
                          value={commentInputs[post._id] || ''}
                          onChange={function(e) {
                            var val = e.target.value;
                            setCommentInputs(function(prev) { return {...prev, [post._id]: val}; });
                          }}
                          onKeyDown={function(e) { if (e.key === 'Enter') handleComment(post._id); }}
                        />
                        <button
                          className="comment-post-btn"
                          onClick={function() { handleComment(post._id); }}
                        >
                          POST
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Floating + Button ── */}
      <button className="fab-btn" onClick={function() { setShowUploadModal(true); }}>
        +
      </button>

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={function(e) { if (e.target.className === 'modal-overlay') setShowUploadModal(false); }}>
          <div className="upload-modal">
            <div className="modal-header">
              <span>NEW POST</span>
              <button className="modal-close" onClick={function() { setShowUploadModal(false); }}>✕</button>
            </div>

            <form onSubmit={handleUpload} className="modal-form">
              <input
                className="neon-input-small"
                type="text"
                placeholder="YOUR USERNAME..."
                value={uploadUser}
                onChange={function(e) { setUploadUser(e.target.value); }}
              />

              <input
                className="neon-input-small"
                type="text"
                placeholder="WRITE A CAPTION..."
                value={uploadCaption}
                onChange={function(e) { setUploadCaption(e.target.value); }}
              />

              <div className="img-drop-zone" onClick={function() { fileInputRef.current.click(); }}>
                {uploadPreview
                  ? <img src={uploadPreview} alt="preview" className="img-preview" />
                  : <span>📁 TAP TO SELECT IMAGE</span>
                }
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <button type="submit" className="upload-submit-btn" disabled={uploading}>
                {uploading ? 'UPLOADING...' : '⬆ SHARE POST'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;