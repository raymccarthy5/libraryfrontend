import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';


const StarRating = ({ rating, onRatingChange, starDimension = '20px', starSpacing = '0px' }) => {
  
    const [tempRating, setTempRating] = useState(0);

    const handleStarClick = (newRating) => {
    onRatingChange(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
            key={i}
            icon={i <= (tempRating || rating) ? solidStar : regularStar}
            style={{
                cursor: 'pointer',
                fontSize: starDimension,
                margin: starSpacing,
                color: i <= (tempRating || rating) ? 'gold' : 'gray',
            }}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => setTempRating(i)}
            onMouseLeave={() => setTempRating(0)}
        />
      );
    }
    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default StarRating;

