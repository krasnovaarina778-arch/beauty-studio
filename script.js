const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

console.log(tg.initDataUnsafe.user);

const button = document.querySelector('.button');

button.addEventListener('click', () => {
    alert('Переходим к записи 💅');
});