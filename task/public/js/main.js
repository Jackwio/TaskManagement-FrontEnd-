
$(document).ready(function () {
    // add-modal
    var myModal = new bootstrap.Modal(document.getElementById('add-modal'));
    // 日曆初始化
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next,addEventButton',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        eventDidMount: function (info) {
            var tooltip = new Tooltip(info.el, {
                title: info.event.extendedProps.description,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        },
        customButtons: {
            addEventButton: {
                text: 'add event...',
                click: function () {

                    

                    myModal.show()
                }
            }
        }
        // events:[]
    });

    // 抓後端父任務
    $.ajax({
        url: 'https://localhost:44366/api/mission/get-parent-mission',
        type: 'POST',
        contentType: 'application/json', // 設置 Content-Type
        success: function (response) {
            // 回傳值結構 json{
            //     "missionId": "c46cf5b3-75f0-25cb-422d-3a13c3d4136d",
            //     "missionState": 0,
            //     "missionPriority": 0,
            //     "missionStartTime": "2024-07-14T14:30:00.127",
            //     "missionEndTime": "2024-07-14T14:30:00.127",
            //     "missionName": "string",
            //     "missionDescription": "string",
            //     "lang": 2,
            //     "missionCategoryName": "fitness",
            //     "id": 5
            // }
            console.log(response);

            $.each(response, function (index, value) {
                var colorDisplay = "#008000";
                if (value["missionPriority"] == 4) {
                    colorDisplay = "#0000FF"
                } else if (value["missionPriority"] == 3) {
                    colorDisplay = "#FFFF00"
                } else if (value["missionPriority"] == 2) {
                    colorDisplay = "#FFA500"
                } else if (value["missionPriority"] == 1) {
                    colorDisplay = "#FF0000"
                }
                calendar.addEvent({
                    id: value["missionId"],
                    title: value["missionName"],
                    description: value["missionDescription"],
                    start: value["missionStartTime"],
                    end: value["missionEndTime"],
                    color: colorDisplay
                })
            });
        },
        error: function (xhr, status, error) {
            $('#result').html('Error: ' + xhr.responseText);
        }
    });

    // 新增任務
    $("#add-mission").on("click", function () {

        var taskName = $('#task-name').val();
        var taskDescription = $('#task-description').val();
        var taskCategory = $('#task-category').val();
        var taskStartDate = $('#task-start-date').val();
        var taskEndDate = $('#task-end-date').val();
        var taskPriority = $('#task-priority').val();
        var data = {
            "missionPriority": taskPriority,
            "missionCategoryId": taskCategory,
            "missionStartTime": taskStartDate,
            "missionEndTime": taskEndDate,
            "missionName": taskName,
            "missionDescription": taskDescription,
            "lang": 1
        };
        console.log(data);

        $.ajax({
            url: 'https://localhost:44366/api/mission/data-post',
            type: 'POST',
            contentType: 'application/json', // 設置 Content-Type
            data: JSON.stringify(data),
            success: function (response) {
                // 回傳值結構 json{
                //   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                //   "missionState": 0,
                //   "missionPriority": 0,
                //   "parentMissionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                //   "missionCategoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                //   "missionStartTime": "2024-07-20T11:44:47.385Z",
                //   "missionEndTime": "2024-07-20T11:44:47.385Z",
                //   "missionName": "string",
                //   "missionDescription": "string",
                //   "lang": 0
                // }

                console.log(response);
                var colorDisplay = "#008000";
                if (data["missionPriority"] == 4) {
                    colorDisplay = "#0000FF"
                } else if (data["missionPriority"] == 3) {
                    colorDisplay = "#FFFF00"
                } else if (data["missionPriority"] == 2) {
                    colorDisplay = "#FFA500"
                } else if (data["missionPriority"] == 1) {
                    colorDisplay = "#FF0000"
                }
                calendar.addEvent({
                    id: response["id"],
                    title: data["missionName"],
                    description: data["missionDescription"],
                    start: data["missionStartTime"],
                    end: data["missionEndTime"],
                    color: colorDisplay
                })

                // 必須用同一個modal變數關閉，不然會無法關
                // var myModal = new bootstrap.Modal(document.getElementById('add-modal'));
                myModal.hide()

            },
            error: function (xhr, status, error) {
                $('#result').html('Error: ' + xhr.responseText);
            }
        });

    });


    calendar.render();
});
