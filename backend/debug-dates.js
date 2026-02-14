const lastActiveStr = "2026-02-14T05:05:47.560Z";
const lastActive = new Date(lastActiveStr);
const today = new Date();

console.log("Last Active (Raw):", lastActiveStr);
console.log("Last Active (Date obj):", lastActive.toString());
console.log("Today (Date obj):", today.toString());

const isToday = lastActive.toDateString() === today.toDateString();
console.log("isToday:", isToday);
console.log("LastActive.toDateString():", lastActive.toDateString());
console.log("Today.toDateString():", today.toDateString());

let streak = 0;
let currentStreak = 0;

if (isToday) {
    streak = Math.max(currentStreak, 1);
    console.log("Logic: active today, streak set to", streak);
} else {
    console.log("Logic: Not today");
}
