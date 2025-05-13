document.addEventListener("DOMContentLoaded", () => {
  const lessonId = parseInt(getQueryParam('id'));

  if (!lessonId) return;

  fetch(`lessons/lesson${lessonId}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .then(lesson => {
      if (!lesson) throw new Error('Урок не найден');

      document.getElementById("lessonTitle").textContent = lesson.title;
      document.getElementById("lessonContent").innerHTML = lesson.content;

      // Разблокировать следующий урок
      const unlocked = new Set(JSON.parse(localStorage.getItem('unlocked')) || [1]);
      unlocked.add(lessonId + 1);
      localStorage.setItem('unlocked', JSON.stringify([...unlocked]));

      // Кнопка "Следующий урок"
      const nextBtn = document.getElementById("nextBtn");
      if (lessonId < 14) {
        nextBtn.onclick = () => {
          window.location.href = `lesson.html?id=${lessonId + 1}`;
        };
      } else {
        nextBtn.textContent = 'Это был последний урок';
        nextBtn.disabled = true;
      }
    })
    .catch(err => {
      console.error("Ошибка при загрузке урока:", err);
      document.getElementById("lessonTitle").textContent = "Ошибка";
      document.getElementById("lessonContent").innerHTML = "<p>Не удалось загрузить урок.</p>";
    });
});
