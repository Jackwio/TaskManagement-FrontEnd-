<template>
  <div class="flex-grow-1 col-lg-9">
    <FullCalendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div class="event-container">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
          <div class="event-description">{{ arg.event.extendedProps.description }}</div>
        </div>
      </template>
    </FullCalendar>
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
                <input type="datetime-local" class="form-control" id="task-start-date"/>
              </div>
              <div class="mb-3 custom-input text-left">
                <label for="task-end-date" class="form-label">end Date</label>
                <input type="datetime-local" class="form-control" id="task-end-date"/>
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
            <button
                id="add-mission"
                type="button"
                class="btn btn-primary"
                @click="addMission"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: "Main",
  components: {
    FullCalendar,
  },
  data: function () {
    return {
      // 主畫面當前語系
      currentLang: 1,
      //add-modal新增語系
      chooseLang: 1,
      currentCategory: "",
      // 所有和當前語系的
      category: [],
      currentLangCategory: [],
      currentEditOrAdd:{

      },
      events: [
        // event definition
        // {
        //   title: "Meeting",
        //   start: "2024-07-29",
        //   end: "2024-07-31",
        //   extendedProps: {
        //     description:
        //       "This is a meeting with the team to discuss the project progress.",
        //   },
        // },
      ],
      currentEvents: [],
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        initialView: "dayGridMonth",
        weekends: true,
        events: this.events, // Use the events array here
        // 點擊月曆上的任務會觸發
        eventClick:this.handleEventClick,
        // 是否能夠拖拉任務
        editable: true,
        // selectMirror: true,
        // 點擊對應日期，即可觸發的動作(下面兩個)
        selectable: true,
        select: this.handleDateSelect,
        headerToolbar: {
          left: "prev,next,addEventButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        },
      },
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

    // 撈後端父任務
    $.ajax({
      url: "http://localhost:44366/api/mission/get-parent-mission",
      type: "GET",
      contentType: "application/json", // 設置 Content-Type
      success: (response) => {
        console.log(response);
        $.each(response, (index, value) => {
          var colorDisplay = "#008000";
          if (value["missionPriority"] == 4) {
            colorDisplay = "#0000FF";
          } else if (value["missionPriority"] == 3) {
            colorDisplay = "#FFFF00";
          } else if (value["missionPriority"] == 2) {
            colorDisplay = "#FFA500";
          } else if (value["missionPriority"] == 1) {
            colorDisplay = "#FF0000";
          }
          this.events.push({
            id: value["missionId"],
            title: value["missionName"],
            extendedProps: {
              description: value["missionDescription"],
            },
            start: value["missionStartTime"],
            end: value["missionEndTime"],
            color: colorDisplay,
            lang: value["lang"],
          });
        });
      },
      error: function (xhr, status, error) {
        console.log(xhr);
        console.log(error);
      },
    });

    // 撈任務類別
    $.ajax({
      url: "http://localhost:44366/api/mission-category/get-all",
      type: "GET",
      contentType: "application/json", // 設置 Content-Type
      // success要改成箭頭函數，不然裡面的this不會是vue實例
      success: (response) => {
        $.each(response, (index, value) => {
          this.category.push(value);
          if (value.lang == this.currentLang) {
            this.currentLangCategory.push(value);
          }
        });
        this.currentCategory = this.currentLangCategory[0]["missionCategoryId"];
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
    // You may need to update calendarOptions to reflect the changes
    this.calendarOptions.events = this.events;
  },
  methods: {

    //  點擊對應日期，即可觸發的動作
    handleDateSelect(selectInfo){
      // 可以得到當前日期
      console.log(selectInfo);

      // 設置開始日期和時間
      var dateString = selectInfo.startStr;
      var date = dateString.split('-');
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedDateTime = `${date[0]}-${date[1]}-${date[2]}T${hours}:${minutes}`;
      $("#task-start-date").val(formattedDateTime);

      var myModal = new bootstrap.Modal(document.getElementById("add-modal"));
      myModal.show();
    },

    // 點擊月曆上的任務會觸發
    handleEventClick(clickInfo) {
      console.log(clickInfo);
    },

    // 新增任務
    addMission() {
      var taskName = $("#task-name").val();
      var taskDescription = $("#task-description").val();
      var taskCategory = $("#task-category").val();
      var taskStartDate = $("#task-start-date").val();
      var taskEndDate = $("#task-end-date").val();
      var taskPriority = $("#task-priority").val();
      var data = {
        missionPriority: taskPriority,
        missionCategoryId: taskCategory,
        missionStartTime: taskStartDate,
        missionEndTime: taskEndDate,
        missionName: taskName,
        missionDescription: taskDescription,
        lang: this.chooseLang,
      };
      console.log(data);

      $.ajax({
        url: "http://localhost:44366/api/mission/data-post",
        type: "POST",
        contentType: "application/json", // 設置 Content-Type
        data: JSON.stringify(data),
        success: (response) => {
          console.log(response);
          var colorDisplay = "#008000";
          if (data["missionPriority"] == 4) {
            colorDisplay = "#0000FF";
          } else if (data["missionPriority"] == 3) {
            colorDisplay = "#FFFF00";
          } else if (data["missionPriority"] == 2) {
            colorDisplay = "#FFA500";
          } else if (data["missionPriority"] == 1) {
            colorDisplay = "#FF0000";
          }
          this.events.push({
            id: response["id"],
            title: data["missionName"],
            description: data["missionDescription"],
            start: data["missionStartTime"],
            end: data["missionEndTime"],
            color: colorDisplay,
          });

          // 必須用同一個modal變數關閉，不然會無法關
          // var myModal = new bootstrap.Modal(document.getElementById('add-modal'));
          myModal.hide();

          toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: "toast-top-center",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
          };
          toastr.success("新增成功");
        },
        error: function (xhr, status, error) {
          $("#result").html("Error: " + xhr.responseText);
        },
      });
      // You may need to update calendarOptions to reflect the changes
      this.calendarOptions.events = this.events;
    },
  },
  watch: {
    // 監測語系改變(新增)
    chooseLang: {
      immediate: true,
      handler(newValue, oldValue) {
        // 更新當前語系
        this.chooseLang = newValue;
        // 清除舊陣列元素
        this.currentLangCategory.length = 0;
        $.each(this.category, (index, value) => {
          if (value.lang == this.chooseLang) {
            this.currentLangCategory.push(value);
          }
        });
      },
    },
    // 監測語系改變(主)
    currentLang: {
      immediate: true,
      handler(newValue, oldValue) {
        // filter月曆上的mission
        console.log('currentLang watch');
        console.log(this.events);
        console.log(this.currentLang);
        // 清除舊陣列元素
        this.currentEvents.length = 0;
        $.each(this.events, (index, value) => {
          if (value.lang == this.currentLang) {
            this.currentEvents.push(value);
          }
        });
        // You may need to update calendarOptions to reflect the changes
        this.calendarOptions.events = this.currentEvents;
      },
    },
  },
};
</script>

<style>
.event-container {
  position: relative;
}

.event-description {
  display: none;
  position: absolute;
  background: #f9f9f9;
  color: black;
  border: 1px solid #ccc;
  padding: 5px;
  z-index: 10000;
  top: 100%;
  left: 0;
}

.event-container:hover .event-description {
  display: block;
}
</style>
