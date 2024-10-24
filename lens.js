const canvas = document.getElementById("simulation-canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = document.documentElement.clientWidth - 50;

let focal_length = 100;
let magnification = 0;

let object = {
    width: 10,
    height: 60,
    x: canvas.width/2 - 205,
    y: canvas.height/2 - 60,
    isDragging: false
};

let image = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

let dark_color = "#222629";
let medium_color = "#6b6e70";
let color1 = "#86c232";
let color2 = "#61892f";

function draw_object() {
    calculate_image();

    let ox = object.x + object.width/2;
    let ix = image.x + image.width/2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = medium_color;
    ctx.fillRect(canvas.width/2-3, 150, 6, 100);
    ctx.fillRect(0, canvas.height/2-1, canvas.width, 2);

    ctx.beginPath();
    ctx.fillStyle = color2;
    ctx.arc(canvas.width/2 - 2 * focal_length, canvas.height/2, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.arc(canvas.width/2 - focal_length, canvas.height/2, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.arc(canvas.width/2 + focal_length, canvas.height/2, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.arc(canvas.width/2 + 2 * focal_length, canvas.height/2, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = color1;
    ctx.fillRect(object.x, object.y, object.width, object.height);
    ctx.fillRect(image.x, image.y, image.width, image.height);

    ctx.beginPath();
    ctx.moveTo(ox, object.y);
    ctx.lineTo(canvas.width/2, 150);
    ctx.lineTo(ix, image.y);
    ctx.lineTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(ox, object.y);
    ctx.lineTo(canvas.width/2, 250);
    ctx.lineTo(ix, image.y);
    ctx.stroke();

    document.getElementById("focal_value").innerHTML = focal_length+" cm";
    document.getElementById("magnification").innerHTML = "x " + magnification.toFixed(2);
    document.getElementById("objectx").innerHTML = (-(object.x + object.width / 2 - canvas.width / 2)).toFixed(2)+" cm";
    document.getElementById("objecty").innerHTML = (-(object.y - canvas.height / 2).toFixed(2))+" cm";
    document.getElementById("imagex").innerHTML = (image.x + image.width / 2 - canvas.width / 2).toFixed(2)+" cm";
    document.getElementById("imagey").innerHTML = (image.y - canvas.height / 2).toFixed(2)+" cm";
}

let offsetX, offsetY;

canvas.addEventListener("mousedown", function (e) {
    const mouse_pos = get_mouse_pos(canvas, e);
    if (is_inside_object(mouse_pos, object)) {
        object.isDragging = true;
        offsetX = mouse_pos.x - object.x;
        offsetY = mouse_pos.y - object.y;
    }
});

canvas.addEventListener("touchstart", function (e) {
    const touch_pos = get_touch_pos(canvas, e);
    if (is_inside_object(touch_pos, object)) {
        e.preventDefault();
        object.isDragging = true;
        offsetX = touch_pos.x - object.x;
        offsetY = touch_pos.y - object.y;
    }
});

canvas.addEventListener("mousemove", function (e) {
    const mouse_pos = get_mouse_pos(canvas, e);

    if (is_inside_object(mouse_pos, object)) {
        canvas.style.cursor = "move";
    } else {
        canvas.style.cursor = "default";
    }

    if (object.isDragging) {
        const newX = mouse_pos.x - offsetX;
        const newY = mouse_pos.y - offsetY;

        object.x = Math.max(0, Math.min(newX, canvas.width/2 - object.width));
        object.y = Math.max(0, Math.min(newY, canvas.height - object.height));

        draw_object();
    }
});

canvas.addEventListener("touchmove", function (e) {
    const touch_pos = get_touch_pos(canvas, e);
    if (object.isDragging) {
        e.preventDefault();
        const newX = touch_pos.x - offsetX;
        const newY = touch_pos.y - offsetY;

        object.x = Math.max(0, Math.min(newX, canvas.width/2 - object.width));
        object.y = Math.max(0, Math.min(newY, canvas.height - object.height));

        draw_object();
    }
});

canvas.addEventListener("mouseup", end_drag);
canvas.addEventListener("mouseout", end_drag);
canvas.addEventListener("touchend", end_drag);

function end_drag() {
    object.isDragging = false;
    ctx.canvas.width = document.documentElement.clientWidth - 50;
    object.x = Math.max(0, Math.min(object.x, canvas.width/2 - object.width));
    draw_object();
};

window.addEventListener("resize", function () {
    ctx.canvas.width = document.documentElement.clientWidth - 50;
    object.x = Math.max(0, Math.min(object.x, canvas.width/2 - object.width));
    draw_object();
});

function get_mouse_pos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}

function get_touch_pos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.touches[0].clientX - rect.left,
      y: evt.touches[0].clientY - rect.top
    };
  }

function is_inside_object(pos, object) {
    return pos.x > object.x && pos.x < object.x + object.width && pos.y > object.y && pos.y < object.y + object.height;
}

function calculate_image() {
    magnification = (1/((1/focal_length)-(1/(canvas.width/2-object.x-object.width/2))))/(canvas.width/2-object.x-object.width/2);
    image.width = object.width * magnification;
    image.height = -object.height * magnification;
    image.x = (canvas.width/2 - object.x - object.width/2) * magnification + canvas.width/2 - image.width/2;
    image.y = canvas.height/2 + (canvas.height/2 - object.y) * magnification
    return;
}

document.getElementById('focal_length').addEventListener('input', (e) => {
    focal_length = parseFloat(e.target.value);
    draw_object();
});

draw_object();