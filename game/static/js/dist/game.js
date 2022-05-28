class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
        <div class="ac-game-menu">
            <div class="ac-game-menu-field">
                <div class="ac-game-menu-field-item ac-game-menu-field-single">
                    单人模式
                </div>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-multi">
                    多人模式
                </div>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-settings">
                    退出
                </div>
            </div>
        </div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-single');
        this.$multi = this.$menu.find('.ac-game-menu-field-multi');
        this.$settings = this.$menu.find('.ac-game-menu-field-settings');
        this.start();
    }

    start() {
        this.add_listening_event();
        this.hide();
    }

    add_listening_event() {
        let outer = this;
        this.$single.click(() => {
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi.click(() => {
            console.log('多人模式');
        });
        this.$settings.click(() => {
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}

let AC_GAME_OBJECTS = [];



class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0;
    }

    start() {  // 只会在第一帧调用

    }

    update() {  // 每一帧会调用

    }

    on_destroy() {  // 在被销毁之前调用

    }

    destroy() {  // 删除该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
            }
        }
    }
}


let last_timestamp;
let AC_GAME_ANIMATION = (timestamp) => {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject {
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
    
}class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.move_length = move_length;
        this.eps = 1;
    }

    start() {

    }

    update() {
        if (this.speed < this.eps || this.move_length < this.eps) {
            this.destroy();
            return;
        } else {
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
            this.speed *= this.friction;
            this.render();
        }
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.x = x;
        this.y = y;
        this.playground = playground;
        this.ctx = playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.is_me = is_me;
        this.eps = 0.1;
        this.cur_skill = null;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.8;
        this.spend_time = 0;
        if (is_me) {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let tx = this.playground.width * Math.random();
            let ty = this.playground.height * Math.random();
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", () => {
            return false;
        });
        this.playground.game_map.$canvas.mousedown((e) => {
            const rect = outer.playground.game_map.ctx.canvas.getBoundingClientRect();

            if (e.which === 3) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown((e) => {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
            }
        });
    }

    shoot_fireball(tx, ty) {
        function get_distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
        let x = this.x, y = this.y;
        let radius = this.radius * 0.2;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.speed * 3;
        let move_length = this.playground.height;
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 15 + Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * 0.1;
            let angle = Math.random() * 2 * Math.PI;
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 5;
            let moved_length = this.radius * 2;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, moved_length);
        }

        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return;
        } else {
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = this.speed * 7;
            this.speed *= 1.25;
        }
    }


    move_to(tx, ty) {
        function get_distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
        this.move_length = get_distance(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update() {
        this.spend_time += this.timedelta / 1000;
        if (!this.is_me && this.spend_time > 5) {
            if (Math.random() < 1.0 / (1000 / this.timedelta) / 5) {
                let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                this.shoot_fireball(player.x, player.y);
            }
        }
        if (this.damage_speed > 10) {
            this.vx = 0;
            this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = 0;
                this.vy = 0;
                if (!this.is_me) {
                    let tx = this.playground.width * Math.random();
                    let ty = this.playground.height * Math.random();
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        if (this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}

class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        for (let player of this.playground.players) {
            if (player === this.player) {
                continue;
            }
            if (this.is_collision(player)) {
                this.attack(player);
                return;
            }
        }
        this.render();
    }

    is_collision(player) {
        function get_distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
        if(get_distance(this.x, this.y, player.x, player.y) < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
        return;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class AcGamePlayground {
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

class Seetings {
    constructor(root) {
        this.root = root;
        this.platform = 'web';
        this.username = '';
        this.photo = '';
        this.$settings = $(`
        <div class="ac-game-settings">
            <div class="ac-game-settings-login">
                <div class="ac-game-settings-title">
                    登陆
                </div>
                <div class="ac-game-settings-username">
                    <div class="ac-game-settings-item">
                        <input type="text" placeholder="用户名">
                    </div>
                </div>
                <div class="ac-game-settings-password">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="密码">
                    </div>
                </div>
                <div class="ac-game-settings-submit">
                    <div class="ac-game-settings-item">
                        <button>登陆</button>
                    </div>
                </div>
                <div class="ac-game-settings-error-message">
                </div>
                <div class="ac-game-settings-option">
                    注册
                </div>
                <br>
                <div class="ac-game-settings-acwing">
                    <img src="https://app2236.acapp.acwing.com.cn/static/image/settings/acwing.png">
                    <br>
                    <br>
                    <div>
                        AcWing一键登录
                    </div>
                </div>
            </div>
            <div class="ac-game-settings-register">
                <div class="ac-game-settings-title">
                    注册
                </div>
                <div class="ac-game-settings-username">
                    <div class="ac-game-settings-item">
                        <input type="text" placeholder="用户名">
                    </div>
                </div>
                <div class="ac-game-settings-password">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="密码">
                    </div>
                </div>
                <div class="ac-game-settings-password ac-game-settings-password-confirm">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="确认密码">
                    </div>
                </div>
                <div class="ac-game-settings-submit">
                    <div class="ac-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>
                <div class="ac-game-settings-error-message">
                </div>
                <div class="ac-game-settings-option">
                    登陆
                </div>
                <br>
                <div class="ac-game-settings-acwing">
                    <img src="https://app2236.acapp.acwing.com.cn/static/image/settings/acwing.png">
                    <br>
                    <br>
                    <div>
                        AcWing一键登录
                    </div>
                </div>
            </div>
        </div>
        `);
        this.$login = this.$settings.find('.ac-game-settings-login');
        this.$login_username = this.$login.find('.ac-game-settings-username input');
        this.$login_password = this.$login.find('.ac-game-settings-password input');
        this.$login_submit = this.$login.find('.ac-game-settings-submit button');
        this.$login_error_message = this.$login.find('.ac-game-settings-error-message');
        this.$login_option = this.$login.find('.ac-game-settings-option');

        this.$register = this.$settings.find('.ac-game-settings-register');
        this.$register_username = this.$register.find('.ac-game-settings-username input');
        this.$register_password = this.$register.find('.ac-game-settings-password input');
        this.$register_password_confirm = this.$register.find('.ac-game-settings-password-confirm input');
        this.$register_submit = this.$register.find('.ac-game-settings-submit button');
        this.$register_error_message = this.$register.find('.ac-game-settings-error-message');
        this.$register_option = this.$register.find('.ac-game-settings-option');
        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);
        if (this.root.AcWingOS)
            this.platform = 'acapp';
        this.start();
    }

    start() {
        this.$login.hide();
        this.$register.hide();
        this.add_listening_events();
        this.get_info();
    }

    login_on_remote() {
        // 登陆远程服务器
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: 'https://app2236.acapp.acwing.com.cn/settings/login/',
            type: 'GET',
            data: {
                "username": username,
                "password": password,
            },
            success: (res) => {
                if (res.result === 'success') {
                    location.reload();
                } else {
                    this.$login_error_message.text(res.result);
                }
            }
        });
    }

    register_on_remote() {
        // 在远程服务器注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();
        $.ajax({
            url: 'https://app2236.acapp.acwing.com.cn/settings/register/',
            type: 'GET',
            data: {
                "username": username,
                "password": password,
                "password_confirm": password_confirm,
            },
            success: (res) => {
                if (res.result === "success") {
                    location.reload();
                } else {
                    this.$register_error_message.text(res.result);
                }
            }
        });
    }

    logout_on_remote() {
        // 登出远程服务器
        if (this.platform === 'acapp') {
            return false;
        }

        $.ajax({
            url: 'https://app2236.acapp.acwing.com.cn/settings/logout/',
            type: 'GET',
            success: function (res) {
                location.reload()
            }
        });
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
        this.$acwing_login.click(() => {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_option.click(function () {
            outer.register();
        });
        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_option.click(function () {
            outer.login();
        });
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {  //  打开登陆界面
        this.$register.hide();
        this.$login.show();
    }

    get_info() {
        let outer = this;
        $.ajax({
            url: "https://app2236.acapp.acwing.com.cn/settings/get_info",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function (res) {
                if (res.result === 'success') {
                    outer.username = res.username;
                    outer.photo = res.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app2236.acapp.acwing.com.cn/settings/acwing/apply_code",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    location.replace(resp.apply_code_url);
                }
            }
        });
    }


    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }

}

export class AcGame {
    constructor(id, AcWingOS) {
        this.id = id;
        this.AcWingOS = AcWingOS;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.settings = new Seetings(this);
        this.start();
    }
    start() {

    }
}