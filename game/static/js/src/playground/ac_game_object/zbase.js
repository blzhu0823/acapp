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

requestAnimationFrame(AC_GAME_ANIMATION);