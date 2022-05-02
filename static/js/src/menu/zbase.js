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
                    设置
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
            console.log('设置');
        });
    }
    
    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}

