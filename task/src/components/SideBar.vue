<template>
  <div class="flex-shrink-0 p-3 col-lg-2">
    <ul id="side-bar-list" class="list-unstyled ps-0">
      <li class="mb-1" v-for="c in currentLangCategory" :key="c.id">
        <button
          class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
          data-bs-toggle="collapse"
          :data-bs-target="'#' + c.id"
          aria-expanded="false"
        >
          {{ c["missionCategoryName"] }}
        </button>
        <div class="collapse" :id="c.id">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li>
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >New</a
              >
            </li>
            <li>
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >Processed</a
              >
            </li>
            <li>
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >Shipped</a
              >
            </li>
            <li>
              <a
                href="#"
                class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >Returned</a
              >
            </li>
          </ul>
        </div>
      </li>
      <li class="border-top my-3"></li>
      <!-- <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded="false"
          >
            Account
          </button>
          <div class="collapse" id="account-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >New...</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Profile</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Settings</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Sign out</a
                >
              </li>
            </ul>
          </div>
        </li>
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#orders-collapse"
            aria-expanded="false"
          >
            Orders
          </button>
          <div class="collapse" id="orders-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >New</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Processed</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Shipped</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Returned</a
                >
              </li>
            </ul>
          </div>
        </li>
        <li class="border-top my-3"></li>
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded="false"
          >
            Account
          </button>
          <div class="collapse" id="account-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >New...</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Profile</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Settings</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >Sign out</a
                >
              </li>
            </ul>
          </div>
        </li> -->
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
      missionCategory: [],
      currentLangCategory: [],
      currentLang: 1,
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
  methods() {},
  watch: {
    // 任務類別
    missionCategory: {
      // 立即監視。可以讓數據還沒發生變化，Vue初次渲染就調用handler函數
      immediate: true,
      // 當被監視屬性發生變化，會自動調用handler方法。參數則可以傳入位置1:newValue,位置2:oldValue
      handler(newValue, oldValue) {
        // 取得任務分類
        $.ajax({
          url: "https://localhost:44366/api/mission-category/get-all",
          type: "GET",
          contentType: "application/json", // 設置 Content-Type
          // success要改成箭頭函數，不然裡面的this不會是vue實例
          success: (response) => {
            // 回傳值結構 json[{
            //     "userId": null,
            //     "missionCategoryI18Dtos": [
            //       {
            //         "missionCategoryName": "健身!",
            //         "lang": 1,
            //         "id": "ad3b205c-2972-0673-d32e-3a13bc952ae4"
            //       },
            //       {
            //         "missionCategoryName": "fitness",
            //         "lang": 2,
            //         "id": "81cdc66c-f0c7-dabe-5248-3a13bc95e0fb"
            //       }
            //     ],
            //     "id": "e0ee31a1-c4db-0860-686a-3a13bc95292e"
            // },....]
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
      immediate: true,
      handler(newValue, oldValue) {
        console.log("篩mission");
        // 清除舊陣列元素
        this.currentLangCategory.length = 0;
        $.each(this.missionCategory, (index, value) => {
          if (value.lang == this.currentLang) {
            this.currentLangCategory.push(value);
          }
        });
      },
    },
  },
};
</script>
