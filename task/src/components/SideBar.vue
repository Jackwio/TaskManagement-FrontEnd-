<template>
  <div class="flex-shrink-0 p-3 col-lg-2">
    <ul id="side-bar-list" class="list-unstyled ps-0">
      <li class="mb-1" v-for="c in currentLangCategory" :key="c.id">
        <button
          :id="'btn' + c.missionCategoryId"
          @click="chooseCategory"
          class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
          data-bs-toggle="collapse"
          :data-bs-target="'#' + c.id"
          aria-expanded="false"
        >
          {{ c["missionCategoryName"] }}
        </button>
        <div class="collapse" :id="c.id">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li v-for="c in currentCategoryMission" :key="c.id">
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >{{ c.missionName }}</a
              >
            </li>
            <!-- <li>
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >New</a
              >
            </li> -->
          </ul>
        </div>
      </li>
      <li class="border-top my-3"></li>
    </ul>
  </div>
</template>

<script setup>
import("/public/css/main.css");
import("/public/js/main.js");
import("/public/css/sideBar.css");
</script>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      mission: [],
      currentCategoryMission: [],
      currentLangMission: [],
      missionCategory: [],
      currentLangCategory: [],
      currentLang: 1,
      currentCategory: "",
      activeCategory: "",
    };
  },
  mounted() {
    // 綁定語言選擇下拉選項點擊事件
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

    // 加載任務類別
    $.ajax({
      url: "http://172.24.144.1:44366/api/mission-category/get-all",
      type: "GET",
      contentType: "application/json", // 設置 Content-Type
      // success要改成箭頭函數，不然裡面的this不會是vue實例
      success: (response) => {
        $.each(response, (index, value) => {
          this.missionCategory.push(value);
          if (value.lang == this.currentLang) {
            this.currentLangCategory.push(value);
          }
        });
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

    // 加載所有任務
    $.ajax({
      url: "http://172.24.144.1:44366/api/mission/get-parent-mission",
      type: "GET",
      contentType: "application/json", // 設置 Content-Type
      // success要改成箭頭函數，不然裡面的this不會是vue實例
      success: (response) => {
        $.each(response, (index, value) => {
          this.mission.push(value);
          if (value.lang == this.currentLang) {
            this.currentLangMission.push(value);
          }
        });
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
  methods: {
    chooseCategory(event) {
      console.log(event.target);
      const targetButton = $(event.target);
      var categoryId = targetButton.attr("id").substring(3);
      this.activeCategory = this.currentCategory === categoryId ? null : categoryId;
      this.currentCategory = categoryId;
      console.log(this.currentCategory);
    },
  },
  watch: {
    // 任務類別
    missionCategory: {
      // 立即監視。可以讓數據還沒發生變化，Vue初次渲染就調用handler函數
      // immediate: true,
      // 當被監視屬性發生變化，會自動調用handler方法。參數則可以傳入位置1:newValue,位置2:oldValue
      handler(newValue, oldValue) {
        // 取得任務分類
        $.ajax({
          url: "http://172.24.144.1:44366/api/mission-category/get-all",
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
    // 監測語系改變
    currentLang: {
      handler(newValue, oldValue) {
        // console.log("篩mission");
        // 清除舊陣列元素
        this.currentLangCategory.length = 0;
        this.currentLangMission.length = 0;
        $.each(this.missionCategory, (index, value) => {
          if (value.lang == this.currentLang) {
            this.currentLangCategory.push(value);
          }
        });
        $.each(this.mission, (index, value) => {
          if (value.lang == this.currentLang) {
            this.currentLangMission.push(value);
          }
        });
      },
    },
    currentCategory: {
      immediate: true,
      handler(newValue, oldValue) {
        // 清除舊陣列元素
        this.currentCategoryMission.length = 0;
        $.each(this.currentLangMission, (index, value) => {
          if (value.missionCategoryId == this.currentCategory) {
            this.currentCategoryMission.push(value);
          }
        });
      },
    },
  },
};
</script>
