import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import styles from "./ThoughtItem.module.css";

const ThoughtItem = ({ thought, incrementLikedPostsCount }) => {
  const { _id, message, hearts, createdAt } = thought;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(hearts);

  useEffect(() => {
    const likedPostsIds = JSON.parse(
      localStorage.getItem("likedPostsIds") || "[]"
    );
    if (likedPostsIds.includes(_id)) {
      setIsLiked(true);
    }
  }, [_id]);

  const handleLike = () => {
    if (!isLiked) {
      fetch(
        `https://project-happy-thoughts-api-vya8.onrender.com/thoughts/${_id}/like`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (response.ok) {
            setIsLiked(true);
            setLikeCount((prevCount) => prevCount + 1);
            incrementLikedPostsCount();

            const updatedLikedPostsIds = JSON.parse(
              localStorage.getItem("likedPostsIds") || "[]"
            );
            if (!updatedLikedPostsIds.includes(_id)) {
              updatedLikedPostsIds.push(_id);
              localStorage.setItem(
                "likedPostsIds",
                JSON.stringify(updatedLikedPostsIds)
              );
            }
          } else {
            throw new Error("Failed to like the thought.");
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  const timeSincePosted = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const secondsPast = (now.getTime() - postedDate.getTime()) / 1000;

    if (secondsPast < 60) {
      return Math.round(secondsPast) === 1
        ? "1 second ago"
        : `${Math.round(secondsPast)} seconds ago`;
    } else if (secondsPast < 3600) {
      const minutes = Math.round(secondsPast / 60);
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else if (secondsPast < 86400) {
      const hours = Math.round(secondsPast / 3600);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else {
      const days = Math.round(secondsPast / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
  };

  return (
    <div className={styles.thoughtItem}>
      <p className={styles.thoughtMessage}>{message}</p>
      <div className={styles.thoughtActions}>
        <div className={styles.likes}>
          <button
            className={`${styles.thoughtLike} ${
              isLiked ? styles.thoughtLiked : ""
            }`}
            onClick={handleLike}
          >
            ❤️
          </button>
          <span>× {likeCount}</span>
        </div>
        <p className={styles.timeSincePosted}>{timeSincePosted(createdAt)}</p>
      </div>
    </div>
  );
};

ThoughtItem.propTypes = {
  thought: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    hearts: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
  incrementLikedPostsCount: PropTypes.func.isRequired,
};

export default ThoughtItem;
