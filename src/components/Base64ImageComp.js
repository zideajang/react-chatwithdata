import React from 'react';
import PropTypes from 'prop-types';

/**
 * React component to display a Base64 encoded image.
 *
 * @param {object} props - The component props.
 * @param {string} props.base64String - The Base64 encoded image data (without the 'data:...' prefix).
 * @param {string} [props.mimeType='image/png'] - The MIME type of the image (e.g., 'image/jpeg', 'image/gif'). Defaults to 'image/png'.
 * @param {string} [props.altText='Base64 Image'] - Alt text for the image, important for accessibility. Defaults to 'Base64 Image'.
 * @param {object} [props.style={}] - Optional CSS style object for the image.
 */
const Base64ImageComp = ({ base64String, mimeType = 'image/png', altText = 'Base64 Image', style = {} }) => {
  // Check if base64String is provided
  if (!base64String) {
    // You can return null, a placeholder, or an error message
    return <p>No image data provided.</p>;
  }

  // Construct the full Data URL string
  const dataUrl = `data:${mimeType};base64,${base64String}`;

  return (
    <img
      src={dataUrl}
      alt={altText}
      style={style}
    />
  );
};

// Add prop types for better documentation and validation (optional but recommended)
Base64ImageComp.propTypes = {
  base64String: PropTypes.string.isRequired, // The base64 encoded string is required
  mimeType: PropTypes.string,                 // MIME type is optional, defaults to 'image/png'
  altText: PropTypes.string,                  // Alt text is optional
  style: PropTypes.object                     // Style object is optional
};

export default Base64ImageComp;