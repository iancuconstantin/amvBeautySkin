const apiKey = 'eyQfwLT2blIJJSiIMMP0DRGTD24g4kgPtcq1YNSm9O491Xm1QbcuDIAW';

const fetchImages = async () => {
  try {
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(`https://api.pexels.com/v1/search?query=beauty%20skin&orientation=landscape&size=medium&per_page=1&page=${randomPage}`, {
      headers: {
        Authorization: apiKey
      }
    });
    const data = await response.json();
    data.photos.forEach(photo => {
      console.log(photo.src.original); // URL-ul imaginii
      // Poți adăuga imaginea într-un element HTML
      const imgElement = document.getElementById('postImage');
      imgElement.src = photo.src.original; 
    });
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

fetchImages();
