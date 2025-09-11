// emoji-sniper.js

class Target {
  constructor(game, emoji, type) {
    this.game = game;
    this.emoji = emoji;
    this.type = type; // "animal" ou "person"
    this.size = 36;
    this.x = Math.random() * (game.width - this.size);
    this.y = Math.random() * (game.height / 2);
    this.dx = (Math.random() * 2 - 1) * 2;
    this.dy = (Math.random() * 2 - 1) * 2;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > this.game.width - this.size) this.dx *= -1;
    if (this.y < 0 || this.y > this.game.height / 2 - this.size) this.dy *= -1;
  }

  draw(ctx) {
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x, this.y);
  }

  isHit(mx, my) {
    return (
      mx >= this.x - this.size / 2 &&
      mx <= this.x + this.size / 2 &&
      my >= this.y - this.size / 2 &&
      my <= this.y + this.size / 2
    );
  }
}

export class EmojiSniperGame {
  constructor(containerId, width = 600, height = 400) {
    this.container = document.getElementById(containerId);
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = "2px solid #333";
    this.canvas.style.background = "#0f1724";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.targets = [];
    this.score = 0;
    this.crosshair = { x: this.width / 2, y: this.height / 2 };
    this.running = true;

    this.animals = ["🐇", "🦊", "🦆", "🦌"];
    this.people = ["👨", "👩", "👶", "🧓"];

    for (let i = 0; i < 8; i++) this.spawnTarget();

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.crosshair.x = e.clientX - rect.left;
      this.crosshair.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("click", () => this.shoot());

    requestAnimationFrame(() => this.loop());
  }

  spawnTarget() {
    const isAnimal = Math.random() < 0.5;
    const emoji = isAnimal
      ? this.animals[Math.floor(Math.random() * this.animals.length)]
      : this.people[Math.floor(Math.random() * this.people.length)];
    const type = isAnimal ? "animal" : "person";
    this.targets.push(new Target(this, emoji, type));
  }

  shoot() {
    for (let i = 0; i < this.targets.length; i++) {
      if (this.targets[i].isHit(this.crosshair.x, this.crosshair.y)) {
        if (this.targets[i].type === "animal") this.score += 10;
        else this.score -= 20;
        this.targets.splice(i, 1);
        this.spawnTarget();
        break;
      }
    }
  }

  drawHUD() {
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);
  }

  drawSniper() {
    this.ctx.font = "40px serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("🔫", this.width / 2, this.height - 30);
  }

  drawCrosshair() {
    this.ctx.font = "28px serif";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("🎯", this.crosshair.x, this.crosshair.y);
  }

  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#0f1724";
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (const t of this.targets) {
      t.update();
      t.draw(this.ctx);
    }

    this.drawSniper();
    this.drawCrosshair();
    this.drawHUD();

    requestAnimationFrame(() => this.loop());
  }
}
