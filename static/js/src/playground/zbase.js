class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
        <div class="ac-game-playground" style="width: 100%; height: 100%"></div>
        `);
        this.start();
    }

    start() {
        this.hide();
    }

    show() {
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        let colors = ["red", "green", "blue", "yellow", "purple"]
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, colors[i], this.height * 0.15, false));
        }
    }

    hide() {
        this.$playground.hide();
    }
}

