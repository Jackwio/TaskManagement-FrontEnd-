<template>
  <div class="flex-grow-1 col-lg-9" style="margin-right: 15px">
    <div id="calendar"></div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="add-modal"
      tabindex="-1"
      aria-labelledby="taskModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskModalLabel">Add New Task</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3 custom-input text-left">
                <label for="lang" class="form-label">語言</label>
                <select id="lang" class="form-select" v-model="chooseLang">
                  <option value="1">繁體中文</option>
                  <option value="2">English</option>
                </select>
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-name" class="form-label">Task Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="task-name"
                  placeholder="Enter task name"
                />
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-description" class="form-label">Task Description</label>
                <input
                  type="text"
                  class="form-control"
                  id="task-description"
                  placeholder="Enter task description"
                />
              </div>
              <!-- 任務類別 -->
              <div class="mb-3 custom-input text-left">
                <label for="task-category" class="form-label">Category</label>
                <select id="task-category" class="form-select" v-model="currentCategory">
                  <option
                    v-for="c in currentLangCategory"
                    :key="c.id"
                    :value="c.missionCategoryId"
                  >
                    {{ c.missionCategoryName }}
                  </option>
                </select>
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-start-date" class="form-label">start Date</label>
                <input type="datetime-local" class="form-control" id="task-start-date" />
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-end-date" class="form-label">end Date</label>
                <input type="datetime-local" class="form-control" id="task-end-date" />
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-priority" class="form-label">Priority</label>
                <select class="form-select" id="task-priority">
                  <option selected>Choose priority</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button id="add-mission" type="button" class="btn btn-primary">
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import("/public/css/main.css");
import("/public/js/main.js");
</script>

<script>
export default {
  name: "Main",
  data() {
    return {
      currentLang: 1,
      chooseLang: "1",
      missionCategory: [
        {
          id: 0,
          missionCategoryName: "Choose Priority",
          lang: this.chooseLang,
        },
      ],
      currentCategory: "0",
      currentLangCategory: [],
      address: "桃園",
    };
  },
  mounted() {
    $("#lang .dropdown-item").on("click", (event) => {
      event.preventDefault();
      const langText = $(event.target).text().trim();
      if (langText === "中文") {
        this.currentLang = 1;
      } else if (langText === "English") {
        this.currentLang = 2;
      } else if (langText === "Español") {
        this.currentLang = 3;
      } else if (langText === "Français") {
        this.currentLang = 4;
      }
      console.log("Current Language:", this.currentLang);
    });
  },
  // computed:{
  //   chooseLang: () => {
  //     console.log(this)
  //   }
  // },
  methods: {
    changeName() {
      this.name = "will";
    },
  },
  // 監視屬性
  watch: {
    // 任務類別
    missionCategory: {
      // 立即監視。可以讓數據還沒發生變化，Vue初次渲染就調用handler函數
      immediate: true,
      // 當被監視屬性發生變化，會自動調用handler方法。參數則可以傳入位置1:newValue,位置2:oldValue
      handler(newValue, oldValue) {
        // 取得任務分類
        $.ajax({
          url: "http://localhost:44366/api/mission-category/get-all",
          type: "GET",
          contentType: "application/json", // 設置 Content-Type
          // success要改成箭頭函數，不然裡面的this不會是vue實例
          success: (response) => {
            $.each(response, (index, value) => {
              this.missionCategory.push(value);
              if (value.lang == this.chooseLang) {
                this.currentLangCategory.push(value);
              }
            });
            this.currentCategory = this.missionCategory[0]["missionCategoryId"];
            console.log(this.missionCategory);
            console.log(this.currentLangCategory);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            const errorResponse = jqXHR.responseJSON;
            $("#errorMessage").text(
              `Error: ${errorResponse.statusCode} - ${errorResponse.message}`
            );
            console.error("Error:", textStatus, errorThrown);
          },
        });
      },
    },
    // 監測語系改變(新增)
    chooseLang: {
      immediate: true,
      handler(newValue, oldValue) {
        // 更新當前語系
        this.chooseLang = newValue;
        // 清除舊陣列元素
        this.currentLangCategory.length = 0;
        $.each(this.missionCategory, (index, value) => {
          if (value.lang == this.chooseLang) {
            this.currentLangCategory.push(value);
          }
        });
      },
    },
    // 監測語系改變(主)
    currentLang: {
      handler(newValue, oldValue) {
        // filter月曆上的mission
        // 清除舊陣列元素
        // this.currentLangCategory.length = 0;
        // $.each(this.missionCategory, (index, value) => {
        //   if (value.lang == this.currentLang) {
        //     this.currentLangCategory.push(value);
        //   }
        // });
      },
    },
  },
};
</script>
