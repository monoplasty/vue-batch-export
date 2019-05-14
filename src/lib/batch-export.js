import { exportExcel } from './export-excel';
export default {
  name: 'batch-export',
  props: {
    url: { // 导出表格的请求路径
      type: String,
      default: '',
    },
    params: { // 导出表格的请求参数
      type: Object,
      default: {},
    },
    export_type: { // 导出表格类型
      type: String,
      default: 'joiners',
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      customers: [],
      listTotal: 0,
      listrows: 1000, // 每个表数量
      downLoadTime: 4000,
      page: 1,
      customize: {},
    };
  },
  methods: {
    load() {
      const that = this;
      const excelListRows = that.listrows;
      const total = that.total;
      let excelTotalAmount = Math.ceil(Number(total) / excelListRows);
      let content = `<div>您要导出的报表包含<span style="padding: 0 5px; color: red;">${total}</span>条数据。</div>`;
      if(excelTotalAmount>1){
        content =  `<div>您要导出的报表包含<span style="padding: 0 5px; color: red;">${total}</span>条数据，为了减少等待时间，系统将为您导出<span style="padding: 0 5px; color: red;">${excelTotalAmount}</span>个excel表格，每个表格最多<span style="padding: 0 5px; color: red;">${excelListRows}</span>条数据，已为您自动编号方便处理。</div>`;
      }
      that.showDialog({
        style: {
          'width': '400px',
          'text-align:': 'center'
        },
        content,
        width: 400,
        button: {
          confirm: '确定',
          cancel: '取消'
        },
        cancel: true,
        confirm: function() {
          that.handleJoinerData(excelTotalAmount);
          return true;
        }
      });
    },
    handleJoinerData(excelTotalAmount) {
      const that = this;
      const listrows = that.listrows;
      const page = that.page;
      let params = that.params;
      params['listrows'] = listrows;
      params['page'] = page;
      that.showLoading();
      const excelJoinersData = {
        list: [],
        total: 0,
      };
      const type = that.export_type || 'joiners';
      switch (type) {
        case 'joiners':
          let p = [];
          for (let i = 0; i < excelTotalAmount; i++) {
            params.page = i + 1;
            p.push(that.$http.get(that.url, {
              params,
            }))
          }
          Promise.all(p).then(res => {

            res.forEach(response => {
              let data = response.json();
              const customers = data.data.list;
              // 数据处理
              excelJoinersData.total = data.data.total || 0;
              excelJoinersData.list = excelJoinersData.list.concat(customers || []);
            })
            // 导出
            exportExcel({
              data: excelJoinersData,
              type,
              excelListRows: that.listrows,
              excelTotalAmount,
              downLoadTime: that.downLoadTime,
            })
            setTimeout(() => {
              that.hideLoading();
            }, that.downLoadTime);
          })
          break;
        default:
          break;
      }
    },

  },
}
