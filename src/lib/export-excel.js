let idTmr;
let currentStep = 0;

function getExplorer() {
  const explorer = window.navigator.userAgent;
  // ie
  let explorerType = '';
  if (explorer.indexOf('MSIE') >= 0) {
    explorerType = 'ie'; // firefox
  } else if (explorer.indexOf('Firefox') >= 0) {
    explorerType = 'Firefox'; // Chrome
  } else if (explorer.indexOf('Chrome') >= 0) {
    explorerType = 'Chrome'; // Opera
  } else if (explorer.indexOf('Opera') >= 0) {
    explorerType = 'Opera'; // Safari
  } else if (explorer.indexOf('Safari') >= 0) {
    explorerType = 'Safari';
  }
  return explorerType;
}

function Cleanup() {
  window.clearInterval(idTmr);
}

function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)));
}

function format(s, c) {
  return s.replace(/{(\w+)}/g, (m, p) => {
    return c[p];
  });
}

function CreateTemplate({
  data,
  type,
  customize,
  excelListRows,
  excelTotalAmount,
}) {
  let columns = [];
  let table = null;
  const listArray = [];
  const tableArr = [];
  const {
    list
  } = data;
  switch (type) {
    case 'joiners':
      columns = [{
          title: '序号',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '当前价格',
          dataIndex: 'current_price',
          key: 'current_price',
        },
        {
          title: '完成时间',
          dataIndex: 'update_time',
          key: 'update_time',
        },
        {
          title: '标记',
          dataIndex: 'is_exchanged',
          key: 'is_exchanged',
        },
        {
          title: '报名时间',
          dataIndex: 'create_time',
          key: 'create_time',
        },
      ];
      break;
    // 每增加一个类型，需要配置表头数据
    case 'groupgoods-joiners':
      columns = [{
          title: '序号',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '身份',
          dataIndex: 'leader',
          key: 'leader',
        },
        {
          title: '报名时间',
          dataIndex: 'created_at',
          key: 'created_at',
        },
      ];
    default:
      break;
  }
  for (let i = 0; i < excelTotalAmount; i++) {
    listArray.push(list.slice(i * excelListRows, (i + 1) * excelListRows));
  }
  for (let n = 0; n < excelTotalAmount; n++) {
    ((n) => {
      table = document.createElement('table');
      const thead = document.createElement('thead');
      const theadTr = document.createElement('tr');
      const theadTd = columns.map((ele, index) => {
        const th = `<th style='border: 1px solid #000;text-align: center;'>${ele.title}</th>`;
        return th;
      });
      theadTr.innerHTML = theadTd.join('');
      thead.appendChild(theadTr);
      const tbody = document.createElement('tbody');
      const tbodyTrs = (listArray[n] || []).map((ele, index) => {
        const trTds = [];
        columns.forEach((e) => {
          if (e.render) {
            trTds.push(`<td style='border: 1px solid #000;text-align: center;'>${e.render(ele, ((excelListRows * n) + index))}</td>`);
          } else {
            trTds.push(`<td style='border: 1px solid #000;text-align: center;'>${ele[e.dataIndex]}</td>`);
          }
        });
        return `<tr>${trTds.join('')}</tr>`;
      });
      tbody.innerHTML = tbodyTrs.join('');
      table.appendChild(thead);
      table.appendChild(tbody);
      const uri = 'data:application/vnd.ms-excel;base64,';
      const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head>' +
        '<!--[if gte mso 9]>' +
        '<xml>' +
        '<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
        '<x:Name>{worksheet}</x:Name>' +
        '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>' +
        '</x:ExcelWorkbook>' +
        '</xml>' +
        '<![endif]-->' +
        '</xml>' +
        '<meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
      const ctx = {
        worksheet: name || 'Worksheet',
        table: table.innerHTML,
      };
      const excelUrl = uri + base64(format(template, ctx));
      tableArr.push(excelUrl);
    })(n);
  }
  return {
    tableArr,
    excelTotalAmount,
  };
}

function tableToExcel(data) {
  const tableData = CreateTemplate(data);
  const {
    downLoadTime
  } = data;
  if (getExplorer() === 'ie') {
    console.log('ie浏览器下不支持');
  } else {
    const downInterval = setInterval(() => {
      const excelUrl = tableData.tableArr[currentStep];
      window.location.href = excelUrl;
      currentStep++;
      if (currentStep === tableData.excelTotalAmount) {
        clearInterval(downInterval);
        currentStep = 0;
        tableData.tableArr = [];
      }
    }, downLoadTime);
  }
}

function exportExcel(data) {
  tableToExcel(data);
}
export {
  exportExcel
};
