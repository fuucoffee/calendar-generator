// Utils
function getTitle(targetMonth = '') {
  return targetMonth.replace('/', '.').replace('-', '.');
}

function parseSearch(searchString) {
  const result = {};
  const queries = searchString.replace(/^\?/, '').split('&');
  for (const query of queries) {
    let [key, value] = query.split('=');
    result[key] = value;
  }
  return result;
}

const query = parseSearch(window.location.search);

// Calendar
function getTableBodyHTML(targetMonth, holidays) {
  const now = new Date(targetMonth);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month,  0);
  const lastDate = new Date(year, month - 1, 0).getDate();

  let date = 1;
  let html = '';
  let w = 0;

  const startDay = start.getDay();
  const endDate = end.getDate();

  while (date <= endDate) {
    html += '<tr>';

    for (let d = 1; d <= 7; d += 1) {
      if (w == 0 && d < start.getDay() + 1) {
        let num = lastDate - startDay + d;
        html += '<td class="disabled">' + num + '</td>';
      } else if (date > endDate) {
        let num = date - endDate;
        html += '<td class="disabled">' + num + '</td>';
        date += 1;
      } else {
        if (holidays.indexOf(date) !== -1) {
          html += '<td class="holiday">' + date + '</td>';
        } else {
          html += '<td>' + date + '</td>';
        }
        date += 1;
      }
    }

    html += '</tr>';
    w += 1;
  }
  return html;
}

const calendarBodyElement = document.querySelector('.calendar tbody');
const calendarTitleElement = document.querySelector('.calendar-title');

calendarTitleElement.innerText = getTitle(query.month);
calendarBodyElement.innerHTML = getTableBodyHTML(query.month, (query.holidays || '').split(',').map((holiday) => Number(holiday)));

// Download
document.querySelector('.download-button').addEventListener('click', () => {
  html2canvas(document.querySelector('.calendar-container')).then(canvas => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = `calendar-${getTitle(query.month)}.png`;
      a.href = url;
      a.click();
      a.remove();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1E4);
    }, 'image/png');
  });
});

// Form
const els = document.querySelectorAll('.calendar-form input');
for (let i = 0; i < els.length; i += 1) {
  const el = els[i];
  const name = el.name;
  if (query[name]) {
    el.value = query[name];
  }
}

document.querySelector('.calendar-form').addEventListener('change', (event) => {
  const el = event.target;
  console.log(el.value, el.name);
});

document.querySelector('.calendar-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const el = event.currentTarget;
  const inputElements = el.querySelectorAll('input');
  const search = [];
  for (let i = 0; i < inputElements.length; i += 1) {
    const inputEl = inputElements[i];
    search.push(`${inputEl.name}=${inputEl.value}`);
  }
  location.search = `?${search.join('&')}`;
});
