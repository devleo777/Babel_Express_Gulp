var tasks = [], editTaksId = '', currentTask;
$(document).ready(function () {
    filterTable();

    let el = $('table').find('tbody')[0];
    let sortable = new Sortable(el, {
        onEnd: dragLeave,
        delay:1500,
        delayOnTouchOnly: true
    });

    $(document).on("click", "a.delete-file", function (e) {
        var taskId = $(e.target).parents("tr.bs-row")[0].id;
        $.ajax({
          type: "PUT",
          url: "/tasks",
          async: false,
          context: document.body,
          data: {
            id: taskId,
            file: null,
            filename: null,
          },
          success: function (d) {
            filterTable();
          },
          error: function (e) {
            console.log(e);
          },
        });
    });
    
    $(document).on("click", "a.rowEDIT", function (e) 
    {
        editTaksId = $(e.target).parents('tr.bs-row')[0].id;
        currentTask = tasks.find(({_id}) => _id === editTaksId);

        $("#hdnSEQUENCE").val($(this).closest("td").parent()[0].sectionRowIndex + 1 );
        $("#edID").val($("table tbody tr:nth-child(" + $("#hdnSEQUENCE").val() + ") td:nth-child(" + 1 +")").text());
        $("#edTASK").val($("table tbody tr:nth-child(" + $("#hdnSEQUENCE").val() + ") td:nth-child(" + 2 + ")").text());
        $("#edDESCRIPTION").val($("table tbody tr:nth-child(" + $("#hdnSEQUENCE").val() + ") td:nth-child(" + 3 + ")").text());
        $("#edAUTHOR").val($("table tbody tr:nth-child(" + $("#hdnSEQUENCE").val() + ") td:nth-child(" + 4 + ")").text());

        let FLG = currentTask.status;
        if (FLG == 1) 
        {
            $("#rdbedFLAGOPEN").prop("checked", true);
        } 
        else if (FLG == 3) 
        {
            $("#rdbedFLAGSTARTED").prop("checked", true);
        } 
        else 
        {
            $("#rdbedFLAGCLOSE").prop("checked", true);
        }

        $("#modalEDIT").modal({backdrop: "true", keyboard: false});
        $("#modalEDIT").modal("show");
    });

    $("#btnedSave").click(function () 
    {
        var FLAG = 1;

        if ($("#rdbedFLAGOPEN").prop("checked")) 
        {
            FLAG = 1;
        } 
        else if ($("#rdbedFLAGCLOSE").prop("checked")) 
        {
            FLAG = 0;
        } 
        else 
        {
            FLAG = 3;
        }
        if (editTaksId) 
        {
            $.ajax({
                type: "PUT",
                url: "/tasks",
                async: false,
                context: document.body,
                data: {
                    id: editTaksId,
                    record: $('#edID').val(),
                    task: $("#edTASK").val(),
                    description: $("#edDESCRIPTION").val(),
                    author: $("#edAUTHOR").val(),
                    status: $("input[name='rdbedFLAG']:checked").val(),
                },
                success: function (d) {
                    editTaksId = null;
                    currentTask = null;
                    console.log("Record has been update!");
                    filterTable();
                    $("#modalEDIT").modal("hide");
                },
                error: function (d) {
                    console.log("Unable to update!");
                    return false;
                },
            }).done(function () {
                console.log("Save Done");
            });
        }
    });

    $(document).on("click", "a.rowDELETE", function (e) 
    {
        e.preventDefault();
        $.ajax({
            type: "DELETE",
            url: "/tasks",
            async: false,
            context: document.body,
            data: {
                id: $(e.target).parents()[4].id,
            },
            success: function (d) {
                console.log("Record has been deleted!");
                filterTable();
            },
            error: function (d) {
                console.log("Unable to delete!");
                return false;
            },
        }).done(function () {
            console.log("Delete Done");
        });
    });

    $("#btnADD").click(function () 
    {
        $("#addTASK").val("");
        $("#addDESCRIPTION").val("");
        $("#addAUTHOR").val("");
        $("#modalADD").modal({backdrop: "true", keyboard: false});
        $("#modalADD").modal("show");
    });

    $("#btnaddSAVE").click(function () 
    {
        $.ajax({
            type: "POST",
            url: "/tasks",
            async: false,
            context: document.body,
            data: {
                record: $('#addID').val(),
                task: $("#addTASK").val(),
                description: $("#addDESCRIPTION").val(),
                author: $("#addAUTHOR").val(),
            },
            success: function (d) 
            {
                console.log("Record has been saved!");
                filterTable();
                $("#modalADD").modal("hide");
            },
            error: function (d) 
            {
                console.log("Duplicate ID!");
                return false;
            },
        }).done(function () {
            console.log("Save Done");
        });
    });

    $("#txtFilter").on("input", function () 
    {
        if (
            $("#txtFilter").val().length >= 3 ||
            $("#txtFilter").val().length == 0
        ) {
            filterTable();
        }
    });

    /*
    * Upload
    */

    $(document).on("click", "a.rowUPLOAD", function (e) 
    {
        var taskId = $(e.target).parents('tr.bs-row')[0].id;
        var currentTask = tasks.find(({_id}) => _id === taskId);

        $("#hdnSEQUENCE").val($(this).closest("td").parent()[0].sectionRowIndex + 1 );
        $("#uploadID").val($("table tbody tr:nth-child(" + $("#hdnSEQUENCE").val() + ") td:nth-child(" + 1 + ")").text());

        $(document).on("click", "#btnSAVE", function (e) 
        {
            e.preventDefault();
            var postData = new FormData($(".formUPLOAD")[0]);
            postData.append('id',taskId);
            const file = $('#uploadFILE').val()
            if (!file) 
            {
                $(".file-err").show();
                return;
            }
            else $(".file-err").hide();

            $.ajax({
                type: "PUT",
                url: "/tasks",
                async: true,
                processData: false,
                contentType: false,
                data: postData,
                success: function (d) {
                    console.log("Record has been saved!!");
                    filterTable();
                    $("#modalUPLOAD").modal("hide");
                },
                error: function (d) {
                    console.log("Duplicate ID!");
                    return false;
                },
            }).done(function () {
                console.log("Done");
            });
        });

    });

    /*
    * Status Select Logic
    */

    $("#selFLAG").change(function (e) 
    {
        if (e.target.value == 1) 
        {
            $('tr .status_open').closest('tr').show();
            $('tr .status_close, tr .status_started').closest('tr').hide();
        } 
        else if (e.target.value == 0) 
        {
            $('tr .status_close').closest('tr').show();
            $('tr .status_open, tr .status_started').closest('tr').hide();
        } 
        else if (e.target.value == 3) 
        {
            $('tr .status_started').closest('tr').show();
            $('tr .status_open, tr .status_close').closest('tr').hide();
        } 
        else 
        {
            $('tr .status_open, tr .status_close, tr .status_started').closest('tr').show();
        }
    });

    /*
    * Set Add New User ID
    */

    fetch("/tasks")
        .then((req) => req.json())
        .then((res) => {
            let id = document.getElementById("addID");
            id.value = res.data.length !== id.value ? res.data.length + 1 : "";
        });

    /*
    * Set userId in Footer
    */

    fetch("/tasks")
        .then((req) => req.json())
        .then((res) => {
            let id = document.getElementById("userId");
            document.getElementById('userId').innerHTML = res.data[0].userId;
        });

});

/*
* Search Results
*/

var search, button, filter, table, tbody, tr, td, row, cell;

search = document.getElementById('search');
search.addEventListener('keyup', results);

button = document.getElementById('button');
button.addEventListener('click', results);

table = document.getElementById("table");
tbody = table.getElementsByTagName("tbody")[0];
tr = tbody.getElementsByTagName("tr");

function results() 
{
    filter = search.value.toUpperCase();

    for (row = 0; row < tr.length; row++) 
    {
        td = tr[row].getElementsByTagName("td");
        tr[row].style.display = "none";

        for (cell = 0; cell < td.length; cell++) 
        {
            if (td[cell].innerHTML.toUpperCase().indexOf(filter) > -1) 
            {
                tr[row].style.display = "";
                continue;
            }
        }
    }
}

/*
* Draggable
*/

var row;

function start() {
    row = event.target;
}

function dragover() {
    var e = event;
    e.preventDefault();

    var taskId = $(e.target).parents('tr.bs-row')[0].id;

    let children = Array.from(e.target.parentNode.parentNode.children);

    if (children.indexOf(e.target.parentNode) > children.indexOf(row)) 
    {
        e.target.parentNode.after(row);
    } 
    else 
    {
        e.target.parentNode.before(row);
    }
}

function dragLeave() 
{
    let record = 0;
    let tasks = [];
    $('table').find('tbody').find('td:nth-of-type(1)').each(function () 
    {
        record += 1;
        let taskId = null;
        taskId = $(this).closest('tr').attr('id');
        let tr = $("#" + taskId);

        let status = 0;
        if (tr.find(".status_badge").text() == 'Opened') 
        {
            status = 1;
        } 
        else if (tr.find(".status_badge").text() == 'Started') 
        {
            status = 3;
        }

        let task = {
            'id': taskId,
            'record': record,
            'task': tr.find(".task").text(),
            'description': tr.find(".description").text(),
            'author': tr.find(".author").text(),
            'status': status
        };
        tasks.push(task);
    })

    $.ajax({
        type: "PUT",
        url: "/position",
        async: false,
        context: document.body,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(tasks),
        success: function (d) 
        {
            taskId = null;
            currentTask = null;
            console.log("Record has been update!");
            filterTable();
        },
        error: function (d) 
        {
            console.log("Error", d);
            console.log("Unable to update!");
            return false;
        },
    }).done(function () {
        console.log("Position Done");
    });
}

function filterTable() 
{
    $.ajax({
        type: "GET",
        url: "/tasks",
        async: false,
        context: document.body,
        success: function (d) {
            if (d.success) {
                tasks = d.data;
                var templateSpec = $("#tasks-tmpl").html();
                var output = $("table > tbody");
                var template = Handlebars.compile(templateSpec);
                output.html(template({tasks}));
                $("#addID").val(tasks.length + 1);
            }
        },
        error: function (d) 
        {
            return false;
        },
    }).done(function () {
        console.log("FilterTable Done");
    });
}