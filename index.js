function getTitle(targetMonth) {
  return targetMonth.replace('/', '.');
}

function parseSearch(searchString) {
  const result = {};
  const queries = searchString.replace(/^\?/, '').split('&');
  for (const query of queries) {
    let [key, value] = query.split('=');

    if (value.indexOf(',') !== -1) {
      value = value.split(',');
    }
    result[key] = value;
  }
  return result;
}

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
      if (w == 0 && d < start.getDay()) {
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

const query = parseSearch(window.location.search);

calendarTitleElement.innerText = getTitle(query.month);
calendarBodyElement.innerHTML = getTableBodyHTML(query.month, query.holidays.map((holiday) => Number(holiday)));
