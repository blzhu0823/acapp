class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`
        <canvas></canvas>
        `);
        this.ctx = this.$canvas.get(0).getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }
    
    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        this.ctx.fillRect(0, 0, this.playground.width, this.playground.height);
    }
    
}