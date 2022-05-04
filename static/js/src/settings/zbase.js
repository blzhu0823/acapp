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
        this.add_listening_events_login();
        this.add_listening_events_register();
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

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }

}

