document.addEventListener("DOMContentLoaded", () => {
  const movieBoxes = document.querySelectorAll(".movie-box");
  const modal = document.getElementById("movie-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalPoster = document.getElementById("modal-poster");
  const modalSynopsis = document.getElementById("modal-synopsis");
  const closeModal = document.getElementsByClassName("close")[0];

  movieBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const title = box.getAttribute("data-title");
      const year = box.getAttribute("data-year");
      const poster = box.getAttribute("data-poster");
      const plot = box.getAttribute("data-plot");
      const rated = box.getAttribute("data-rated");
      const released = box.getAttribute("data-released");
      const runtime = box.getAttribute("data-runtime");
      const genre = box.getAttribute("data-genre");
      const director = box.getAttribute("data-director");
      const writer = box.getAttribute("data-writer");
      const actors = box.getAttribute("data-actors");
      const language = box.getAttribute("data-language");
      const country = box.getAttribute("data-country");
      const awards = box.getAttribute("data-awards");
      const imdbRating = box.getAttribute("data-imdbRating");
      const imdbVotes = box.getAttribute("data-imdbVotes");
      const imdbID = box.getAttribute("data-imdbID");

      modalTitle.innerText = `${title} (${year})`;
      modalPoster.src = poster;
      modalSynopsis.innerHTML = `
        <strong>Plot:</strong> ${plot}<br>
        <strong>Rated:</strong> ${rated}<br>
        <strong>Released:</strong> ${released}<br>
        <strong>Runtime:</strong> ${runtime}<br>
        <strong>Genre:</strong> ${genre}<br>
        <strong>Director:</strong> ${director}<br>
        <strong>Writer:</strong> ${writer}<br>
        <strong>Actors:</strong> ${actors}<br>
        <strong>Language:</strong> ${language}<br>
        <strong>Country:</strong> ${country}<br>
        <strong>Awards:</strong> ${awards}<br>
        <strong>IMDb Rating:</strong> ${imdbRating}<br>
        <strong>IMDb Votes:</strong> ${imdbVotes}<br>
      `;
      const stars = document.querySelectorAll(".star");
      stars.forEach((star) => {
        star.addEventListener("click", () => {
          const value = star.getAttribute("data-value");
          stars.forEach((s) => s.classList.remove("selected"));
          star.classList.add("selected");
          document.getElementById("rating").innerText = `Rating: ${value}`;
        });
      });

      modal.style.display = "block";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});