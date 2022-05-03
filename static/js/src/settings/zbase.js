class Seetings {
    constructor(root) {
        this.root = root;
        this.platform = 'web';
        this.username = '';
        this.photo = '';
        this.$settings = $(`
        <div class="ac-game-settings">
            <div class="ac-game-settings-login">
            </div>
            <div class="ac-game-settings-register">
            </div>
        </div>
        `);
        this.$login = this.$settings.find('.ac-game-settings-login');
        this.$register = this.$settings.find('.ac-game-settings-register');
        this.root.$ac_game.append(this.$settings);
        if (this.root.AcWingOS)
            this.platform = 'acapp';
        this.start();
    }

    start() {
        this.$login.hide();
        this.$register.hide();
        this.get_info();
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
                console.log(res);
                if(res.result === 'success') {
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

