const SUPABASE_URL = "https://xtwsirfjsmxvylhxvdye.supabase.co";

const SUPABASE_KEY = "sb_publishable_SpOfOsk56z19aAW34o0SQw_C-rEFv_s";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}


/* =========================
   STATE
========================= */

const booking = {
    service: null,
    price: null,
    duration: null,
    date: null,
    time: null,
    name: "",
    phone: "",
    comment: ""
};


/* =========================
   SCREENS
========================= */

const screens = {
    home: document.getElementById("homeScreen"),
    services: document.getElementById("bookingScreen"),
    date: document.getElementById("dateScreen"),
    form: document.getElementById("formScreen"),
    success: document.getElementById("successScreen")
};


function showScreen(screen) {

    Object.values(screens).forEach(item => {
        item.classList.remove("screen--active");
    });

    screen.classList.add("screen--active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   HOME → SERVICES
========================= */

document
    .getElementById("startBooking")
    .addEventListener("click", () => {

        showScreen(screens.services);

    });


/* =========================
   BACK BUTTONS
========================= */

document
    .getElementById("backToHome")
    .addEventListener("click", () => {

        showScreen(screens.home);

    });


document
    .getElementById("backToServices")
    .addEventListener("click", () => {

        showScreen(screens.services);

    });


document
    .getElementById("backToDate")
    .addEventListener("click", () => {

        showScreen(screens.date);

    });


/* =========================
   SERVICES
========================= */

const serviceButtons =
    document.querySelectorAll(".booking-service");


serviceButtons.forEach(button => {

    button.addEventListener("click", () => {

        serviceButtons.forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");


        booking.service =
            button.dataset.service;

        booking.price =
            Number(button.dataset.price);

        booking.duration =
            button.dataset.duration;


        document.getElementById(
            "selectedService"
        ).textContent =
            `${booking.service} · ${formatPrice(booking.price)}`;


        showScreen(screens.date);

        renderCalendar();

    });

});


/* =========================
   CALENDAR
========================= */

const calendarDays =
    document.getElementById("calendarDays");

const monthName =
    document.getElementById("monthName");


let calendarStart = new Date();

calendarStart.setHours(0, 0, 0, 0);


/*
    Для демо показываем
    ближайшие 14 дней.
*/

function renderCalendar() {

    calendarDays.innerHTML = "";

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const days = [];

    for (let i = 0; i < 14; i++) {

        const date = new Date(calendarStart);

        date.setDate(
            calendarStart.getDate() + i
        );

        days.push(date);

    }


    if (days.length) {

        const formatter =
            new Intl.DateTimeFormat(
                "ru-RU",
                {
                    month: "long"
                }
            );

        monthName.textContent =
            formatter
                .format(days[0])
                .replace(/^./, letter =>
                    letter.toUpperCase()
                );

    }


    days.forEach(date => {

        const button =
            document.createElement("button");


        button.textContent =
            date.getDate();


        const isPast =
            date < today;


        if (isPast) {

            button.classList.add("disabled");

            button.disabled = true;

        }


        if (
            booking.date &&
            isSameDay(
                date,
                booking.date
            )
        ) {

            button.classList.add("selected");

        }


        button.addEventListener(
            "click",
            () => {

                booking.date =
                    new Date(date);

                booking.time = null;

                renderCalendar();

                renderTimes();

                updateContinueButton();

            }
        );


        calendarDays.appendChild(button);

    });

}


/* =========================
   CALENDAR NAVIGATION
========================= */

document
    .getElementById("previousWeek")
    .addEventListener("click", () => {

        calendarStart.setDate(
            calendarStart.getDate() - 7
        );

        renderCalendar();

    });


document
    .getElementById("nextWeek")
    .addEventListener("click", () => {

        calendarStart.setDate(
            calendarStart.getDate() + 7
        );

        renderCalendar();

    });


/* =========================
   TIME
========================= */

const timeGrid =
    document.getElementById("timeGrid");


const availableTimes = [
    "10:00",
    "11:30",
    "13:00",
    "14:30",
    "16:00",
    "17:30"
];


function renderTimes() {

    timeGrid.innerHTML = "";


    availableTimes.forEach(time => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "time-button";


        button.textContent = time;


        if (booking.time === time) {

            button.classList.add("selected");

        }


        button.addEventListener(
            "click",
            () => {

                booking.time = time;

                renderTimes();

                updateContinueButton();

            }
        );


        timeGrid.appendChild(button);

    });

}


/* =========================
   CONTINUE
========================= */

function updateContinueButton() {

    const button =
        document.getElementById(
            "continueToForm"
        );


    const ready =
        booking.date &&
        booking.time;


    button.disabled = !ready;

    button.classList.toggle(
        "disabled",
        !ready
    );

}


document
    .getElementById("continueToForm")
    .addEventListener("click", () => {

        if (
            !booking.date ||
            !booking.time
        ) {
            return;
        }


        updateSummary();

        showScreen(screens.form);

    });


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    document.getElementById(
        "summaryService"
    ).textContent =
        booking.service;


    document.getElementById(
        "summaryPrice"
    ).textContent =
        formatPrice(booking.price);


    document.getElementById(
        "summaryDate"
    ).textContent =
        formatDate(booking.date);


    document.getElementById(
        "summaryTime"
    ).textContent =
        booking.time;

}


/* =========================
   FORM
========================= */

document
    .getElementById("bookingForm")
    .addEventListener("submit", async event => {

        event.preventDefault();

        booking.name =
            document.getElementById("clientName").value.trim();

        booking.phone =
            document.getElementById("clientPhone").value.trim();

        booking.comment =
            document.getElementById("clientComment").value.trim();

        if (!booking.name || !booking.phone) {
            return;
        }

        try {

            const { error } = await supabaseClient
                .from("appointments")
                .insert([
                    {
                        service: booking.service,
                        price: booking.price,
                        duration: booking.duration,
                        appointment_date: formatDatabaseDate(booking.date),
                        appointment_time: booking.time,
                        client_name: booking.name,
                        client_phone: booking.phone,
                        client_comment: booking.comment,
                        telegram_user_id:
                            tg?.initDataUnsafe?.user?.id || null,
                        telegram_username:
                            tg?.initDataUnsafe?.user?.username || null
                    }
                ]);

            if (error) {
                console.error("Ошибка Supabase:", error);
                alert("Не удалось сохранить запись. Попробуйте ещё раз.");
                return;
            }

            console.log("Запись сохранена");

            showSuccess();

        } catch (error) {

            console.error("Ошибка:", error);
            alert("Произошла ошибка. Попробуйте ещё раз.");

        }

    });



/* =========================
   SUCCESS
========================= */

function showSuccess() {

    document.getElementById(
        "successService"
    ).textContent =
        booking.service;


    document.getElementById(
        "successDate"
    ).textContent =
        formatDate(booking.date);


    document.getElementById(
        "successTime"
    ).textContent =
        booking.time;


    showScreen(screens.success);

}


document
    .getElementById("closeApp")
    .addEventListener("click", () => {

        showScreen(screens.home);

    });


/* =========================
   HELPERS
========================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "ru-RU"
    ).format(price) + " ₽";

}


function formatDate(date) {

    if (!date) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "ru-RU",
        {
            day: "numeric",
            month: "long"
        }
    ).format(date);

}

function formatDatabaseDate(date) {

    if (!date) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isSameDay(date1, date2) {

    return (
        date1.getFullYear() ===
            date2.getFullYear() &&

        date1.getMonth() ===
            date2.getMonth() &&

        date1.getDate() ===
            date2.getDate()
    );

}


/* =========================
   INIT
========================= */

renderCalendar();
renderTimes();
updateContinueButton();