<template>
  <div class="my-2">
    <!-- <div class="m-btn">
      <v-btn color="warning small " dark @click="tabInfo(1)">亚诺教育</v-btn>
      <v-btn color="primary small" dark @click="tabInfo(6)">瑞迪艺术</v-btn>
    </div> -->
    <div class="m-input">
      <v-select :items="brand" label="校区" v-model="school" dense outlined></v-select>
      <v-select :items="gradeList" label="年级" v-model="grade" dense outlined></v-select>
      <v-select :items="subjectList" label="学科" v-model="subject" dense outlined></v-select>
      <v-select :items="termList" label="学期" v-model="term" dense outlined></v-select>
      <v-select :items="ClassTypeList" label="班型" v-model="ClassType" dense outlined></v-select>
      <v-btn color="primary small" dark @click="search()">搜索</v-btn>
    </div>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1"></v-data-table>
    <div class="m-btn2 m-fix">
      <v-btn style="background: #2196F3" color=" small " dark @click="prve()" v-if="prveKey">上一页</v-btn>
      <v-btn style="background: #2196F3" color=" small " dark @click="next()" v-if="nextKey">下一页</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      prveKey: true,
      nextKey: true,
      brand:['亚诺阳山校区','亚诺姑苏校区','瑞迪阳山校区','瑞迪科技城校区'],
      school:'',
      gradeList: [],
      subjectList: [],
      ClassTypeList: [],
      termList: [],
      gradeListSearch: [],
      subjectListSearch: [],
      ClassTypeListSearch: [],
      termListSearch: [],
      grade: "",
      subject: "",
      ClassType: "",
      term: "",
      headers: [
        {
          text: "班级",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "满班人数", value: "max_student_amount" },
        { text: "实际人数", value: "real_student_amount" },
        { text: "上课时间", value: "course_time" },
        { text: "开班时间", value: "opendate" }
        // { text: "更新时间", value: "updatetime" }
      ],
      desserts: [],
      filter: {
        name: "",
        full: -1,
        company_id: 1,
        page_size: 10,
        page: 1,
        subject_id: "",
        grade_id: "",
        type_id: "",
        term_id: "",
        year: ""
      }
    };
  },
  methods: {
    prve() {
      const that = this;
      const filter = that.filter;
      if (filter.page != 1) {
        filter.page--;
      }
      console.log(filter.page);
      that.getInfo(filter);
    },
    next() {
      const that = this;
      const filter = that.filter;
      filter.page++;
      console.log(filter.page);
      that.getInfo(filter);
    },
    //切换学校
    tabInfo(company_id) {
      const that = this;
      let filter = that.filter;
      filter.company_id = company_id;
      filter.page = 1;
      that.getInfo(filter);
      that.getNav();
      console.log(company_id);
    },
    //获取数据
    getInfo(filter) {
      const that = this;
      const url_api = "/api/index/get_class_list";
      that.axios
        .post(url_api, filter || that.filter)
        .then(function(res) {
          if (res.data.class_list.length == 0) {
            that.nextKey = false;
          } else {
            that.nextKey = true;
          }
          that.desserts = res.data.class_list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    accReduce(unitem) {
      const l = unitem.reduce((acc, item) => {
        if (item.value.search("-") != -1) {
          acc.push(item.value.split("-")[1]);
        } else {
          acc.push(item.value);
        }
        return acc;
      }, []);
      return l;
    },
    //获取学科课程班级
    getNav() {
      const that = this;
      const url_api = "/api/index/get_dict";
      that.axios
        .post(url_api, { company_id: that.filter.company_id })
        .then(res => {
          const sub = { xiaoguanjia_id: 0, value: "请选择学科" };
          const gra = { xiaoguanjia_id: 0, value: "请选择年级" };
          const alt = { xiaoguanjia_id: 0, value: "请选择班型" };
          const ter = { term_id: 0, value: "0-请选择学期", year: "" };
          const grade_list = res.data.grade_list;
          const subject_list = res.data.subject_list;
          const shift_list = res.data.shift_list;
          const term_list = res.data.year_term_list;
          grade_list.unshift(gra);
          subject_list.unshift(sub);
          shift_list.unshift(alt);
          term_list.unshift(ter);
          that.gradeListSearch = grade_list; //未处理时的数据
          that.subjectListSearch = subject_list;
          that.ClassTypeListSearch = shift_list;
          that.termListSearch = term_list;
          const l1 = that.accReduce(grade_list); //处理过后的数据
          const l2 = that.accReduce(shift_list);
          const l3 = that.accReduce(subject_list);
          const l4 = term_list.reduce((res, int) => {
            res.push(`${int.year}${int.value.split("-")[1]}`);
            return res;
          }, []);
          that.gradeList = l1;
          that.ClassTypeList = l2;
          that.subjectList = l3;
          that.termList = l4;
        });
    },
    //选择框赋值
    filterData(res, type, typeSearch) {
      const that = this;
      const filter = that.filter;
      const search = that[typeSearch];
      const lastData = search.reduce((acc, item, index) => {
        if (item.value.search(res) != -1) {
          acc = item.xiaoguanjia_id;
        }
        return acc;
      });
      const finalData =
        typeof lastData == "object" ? lastData.xiaoguanjia_id : lastData;
      filter[type] = finalData;
      console.log(that.filter);
    },
    //查询
    search() {
      const that = this;
      const filter = that.filter;
      console.log(filter);
      that.getInfo(filter);
    }
  },
  watch: {
    grade(res) {
      this.filterData(res, "grade_id", "gradeListSearch");
    },
    subject(res) {
      this.filterData(res, "subject_id", "subjectListSearch");
    },
    ClassType(res) {
      this.filterData(res, "type_id", "ClassTypeListSearch");
    },
    term(res) {
      const that = this;
      const filter = that.filter;
      that.termListSearch.forEach(item => {
        if (`${item.year}${item.value.split("-")[1]}`.search(res) != -1) {
          filter[`year`] = item.year;
          filter[`term_id`] = item.term_id;
        }
      });
    },
    school(res){
      const that = this
      const company_id=[1,30,3,6]
      that.brand.forEach((item,index)=>{
        if(item.search(res)!=-1){
          that.filter[`company_id`] = company_id[index]
        }
      })
    }
  },
  created() {
    const that = this;
    that.getInfo();
    that.getNav();
  }
};
</script>
<style  scoped>
.m-btn {
  margin-bottom: 8px;
  margin-left: 12px;
}
.m-btn button,
.m-btn2 button {
  margin-right: 8px;
}
.m-fix {
  position: fixed;
  width: 100%;
  height: 50px;
  left: 0;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #dfdfdf;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.m-input {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  padding: 13px;
}
.m-input .v-input {
  max-width: 48%;
}
</style>