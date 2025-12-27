import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/de";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.locale("de");

dayjs.updateLocale("de", {
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: "ein paar Sekunden",
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tagen",
    M: "einem Monat",
    MM: "%d Monaten",
    y: "einem Jahr",
    yy: "%d Jahren",
  },
});

export { dayjs };
