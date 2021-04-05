export default class Modal {
  constructor(scores) {
    this.scores = scores;
    this.$modal = document.getElementById('score-table');
    this.$modalButton = document.getElementById('score-button');
    this.$modalData = this.$modal.querySelector('.modal__data');
    this.$modalClose = this.$modal.querySelector('.modal__close');
    this.opened = false;

    this.$modalButton.addEventListener('click', this.open.bind(this));
    this.$modalClose.addEventListener('click', this.close.bind(this));
    this.outside.bind(this);
  }

  parseContent() {
    const scoreRow = Object.entries(this.scores)
      .sort(([, a], [, b]) => b.score - a.score)
      .map(
        (score, index) => `<tr>
        <th scope="row">${index + 1}</th>
        <td>${score[0]}</td>
        <td>${score[1].score}</td>
        <td>${score[1].level}</td>
        <td>${score[1].speed}</td>
      </tr>`,
      )
      .join('');

    return `<table class="modal__table">
        <caption>🏆 Leaderboard 🏆</caption>
        <thead>
            <tr>
                <th>#</th>
                <th>Nickname</th>
                <th>Score</th>
                <th>Level</th>
                <th>Speed</th>
            </tr>
        </thead>
        <tbody>
            ${scoreRow}
        </tbody>
    </table>`;
  }

  open() {
    this.$modalData.innerHTML = this.parseContent();
    this.$modal.style.display = 'block';

    !this.opened && this.outside();
  }

  close() {
    this.$modal.style.display = 'none';
  }

  outside() {
    window.addEventListener('click', (e) => {
      if (e.target === this.$modal) {
        this.close();
        this.opened = true;
      }
    });
  }
}
